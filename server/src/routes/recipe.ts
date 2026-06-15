import { Router, Request, Response } from 'express';
import OpenAI from 'openai';
import { validateRecipeRequest } from '../middleware/validation';
import type { RecipeRequest, Recipe } from '../types/index';

const router = Router();

function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not set.');
  }
  return new OpenAI({
    apiKey,
    baseURL: process.env.OPENAI_BASE_URL ?? 'https://api.openai.com/v1',
  });
}

function buildPrompt(request: RecipeRequest): string {
  const { ingredients, cuisineType, dietaryRestrictions, servings, difficulty } = request;

  const parts: string[] = [
    `Available ingredients: ${ingredients.join(', ')}`,
  ];
  if (cuisineType) parts.push(`Cuisine type: ${cuisineType}`);
  if (dietaryRestrictions && dietaryRestrictions.length > 0) {
    parts.push(`Dietary restrictions: ${dietaryRestrictions.join(', ')}`);
  }
  if (servings) parts.push(`Servings: ${servings}`);
  if (difficulty) parts.push(`Difficulty level: ${difficulty}`);

  return parts.join('\n');
}

const SYSTEM_PROMPT = `You are an expert chef and nutritionist. Generate a complete, detailed, and delicious recipe based on the user's available ingredients and preferences.

You MUST respond with ONLY a valid JSON object — no markdown fences, no explanations, no extra text. The JSON must exactly match this structure:

{
  "title": "Recipe Name",
  "description": "2-3 sentence appetizing description of the dish",
  "prepTime": "X minutes",
  "cookTime": "X minutes",
  "totalTime": "X minutes",
  "servings": 4,
  "difficulty": "Easy",
  "cuisineType": "Italian",
  "ingredients": [
    { "amount": "2", "unit": "cups", "name": "all-purpose flour", "notes": "sifted" }
  ],
  "instructions": [
    "Detailed step 1...",
    "Detailed step 2..."
  ],
  "nutritionEstimate": {
    "calories": "450",
    "protein": "25g",
    "carbohydrates": "55g",
    "fat": "12g",
    "fiber": "4g"
  },
  "cookingTips": [
    "Helpful tip 1...",
    "Helpful tip 2..."
  ]
}

Rules:
- Use primarily the listed ingredients but you may add pantry staples (salt, pepper, oil, water, common spices) as needed
- Provide at least 6 detailed instructions
- Provide 2-4 cooking tips
- All times should be realistic
- Nutrition estimates should be reasonable approximations
- If no cuisine is specified, choose one that best fits the ingredients
- If no difficulty is specified, choose the appropriate level
- The title should be creative and appetizing`;

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
      max_tokens: 2000,
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
      // Attempt to extract JSON if model added surrounding text
      const match = content.match(/\{[\s\S]*\}/);
      if (!match) {
        res.status(500).json({ success: false, error: 'AI returned invalid JSON.' });
        return;
      }
      recipe = JSON.parse(match[0]) as Recipe;
    }

    // Basic shape validation
    if (!recipe.title || !recipe.ingredients || !recipe.instructions) {
      res.status(500).json({ success: false, error: 'AI returned incomplete recipe data.' });
      return;
    }

    res.json({ success: true, data: recipe });
  } catch (error: unknown) {
    console.error('Recipe generation error:', error);

    if (error instanceof Error) {
      const msg = error.message;
      if (msg.includes('API key') || msg.includes('authentication') || msg.includes('401')) {
        res.status(401).json({ success: false, error: 'Invalid or missing API key. Check your OPENAI_API_KEY environment variable.' });
        return;
      }
      if (msg.includes('rate limit') || msg.includes('429')) {
        res.status(429).json({ success: false, error: 'API rate limit exceeded. Please wait a moment before trying again.' });
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
