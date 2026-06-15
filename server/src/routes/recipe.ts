import { Router, Request, Response } from 'express';
import OpenAI from 'openai';
import { validateRecipeRequest } from '../middleware/validation';
import type { RecipeRequest, Recipe } from '../types/index';

const router = Router();

function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY environment variable is not set.');
  return new OpenAI({
    apiKey,
    baseURL: process.env.OPENAI_BASE_URL ?? 'https://api.openai.com/v1',
  });
}

function buildPrompt(request: RecipeRequest): string {
  const { ingredients, cuisineType, dietaryRestrictions, servings, difficulty } = request;
  const parts: string[] = [
    `Available ingredients the user has on hand: ${ingredients.join(', ')}`,
    `(Use only the ingredients that naturally belong in the recipe — do NOT force every ingredient in.)`,
  ];
  if (cuisineType) parts.push(`Preferred cuisine: ${cuisineType}`);
  if (dietaryRestrictions?.length) parts.push(`Dietary restrictions: ${dietaryRestrictions.join(', ')}`);
  if (servings) parts.push(`Desired servings: ${servings}`);
  if (difficulty) parts.push(`Difficulty level: ${difficulty}`);
  return parts.join('\n');
}

const SYSTEM_PROMPT = `You are an expert chef and nutritionist. Your job is to create the best possible recipe using SOME OR ALL of the user's available ingredients.

KEY RULES:
1. The user's ingredients are AVAILABLE ingredients, NOT required ingredients.
2. Pick only the ingredients that naturally fit together into a great recipe.
3. If some user ingredients don't belong in the dish (e.g. strawberries in a stir-fry), leave them out entirely.
4. Recipe quality and culinary realism ALWAYS take priority over using every ingredient.
5. You may add pantry staples (salt, pepper, oil, water) as needed — these do NOT count as unused ingredients.
6. List any user-provided ingredients you chose not to use in "unusedIngredients".
7. Recommend 3-5 additional ingredients the user could add to improve the dish further.

Return ONLY a valid JSON object — no markdown, no explanation, just JSON:

{
  "title": "Recipe Name",
  "description": "2-3 sentence appetizing description",
  "prepTime": "X minutes",
  "cookTime": "X minutes",
  "totalTime": "X minutes",
  "servings": 4,
  "difficulty": "Easy",
  "cuisineType": "Italian",
  "ingredients": [
    { "amount": "2", "unit": "cups", "name": "rice", "notes": "rinsed" }
  ],
  "instructions": [
    "Step 1: ...",
    "Step 2: ..."
  ],
  "nutritionEstimate": {
    "calories": "450",
    "protein": "28g",
    "carbohydrates": "52g",
    "fat": "14g",
    "fiber": "5g"
  },
  "cookingTips": [
    "Tip 1...",
    "Tip 2..."
  ],
  "unusedIngredients": ["strawberries", "peanut butter"],
  "recommendedIngredients": [
    {
      "name": "fresh ginger",
      "quantity": "1 tablespoon, grated",
      "reason": "Adds warmth and aromatic depth that complements the dish beautifully"
    }
  ]
}

Rules for unusedIngredients:
- Only list user-provided ingredients you deliberately chose NOT to use
- Do NOT list pantry staples (salt, pepper, oil, etc.)
- If you used all user ingredients, return an empty array []

Rules for recommendedIngredients:
- Suggest 3-5 ingredients the user likely doesn't have but that would elevate the dish
- Include herbs, spices, aromatics, sauces, garnishes, or specialty ingredients
- Be specific about quantity and give a genuinely helpful reason for each`;

router.post('/generate', validateRecipeRequest, async (req: Request, res: Response): Promise<void> => {
  try {
    const request = req.body as RecipeRequest;
    const client = getOpenAIClient();
    const model = process.env.OPENAI_MODEL ?? 'gpt-4o-mini';

    const completion = await client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: buildPrompt(request) },
      ],
      temperature: 0.8,
      max_tokens: 2500,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      res.status(500).json({ success: false, error: 'AI returned an empty response.' });
      return;
    }

    let recipe: Recipe;
    try {
      recipe = JSON.parse(content) as Recipe;
    } catch {
      const match = content.match(/\{[\s\S]*\}/);
      if (!match) {
        res.status(500).json({ success: false, error: 'AI returned invalid JSON.' });
        return;
      }
      recipe = JSON.parse(match[0]) as Recipe;
    }

    if (!recipe.title || !recipe.ingredients || !recipe.instructions) {
      res.status(500).json({ success: false, error: 'AI returned incomplete recipe data.' });
      return;
    }

    // Ensure new fields are always present
    recipe.unusedIngredients = recipe.unusedIngredients ?? [];
    recipe.recommendedIngredients = recipe.recommendedIngredients ?? [];

    res.json({ success: true, data: recipe });
  } catch (error: unknown) {
    console.error('Recipe generation error:', error);
    if (error instanceof Error) {
      const msg = error.message;
      if (msg.includes('API key') || msg.includes('authentication') || msg.includes('401')) {
        res.status(401).json({ success: false, error: 'Invalid or missing API key.' });
        return;
      }
      if (msg.includes('rate limit') || msg.includes('429')) {
        res.status(429).json({ success: false, error: 'API rate limit exceeded. Please wait a moment.' });
        return;
      }
      if (msg.includes('OPENAI_API_KEY environment variable is not set')) {
        res.status(500).json({ success: false, error: msg });
        return;
      }
    }
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred.',
    });
  }
});

export default router;
