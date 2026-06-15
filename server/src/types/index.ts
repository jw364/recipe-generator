export interface RecipeIngredient {
  amount: string;
  unit: string;
  name: string;
  notes?: string;
}

export interface NutritionInfo {
  calories: string;
  protein: string;
  carbohydrates: string;
  fat: string;
  fiber: string;
}

export interface Recipe {
  title: string;
  description: string;
  prepTime: string;
  cookTime: string;
  totalTime: string;
  servings: number;
  difficulty: string;
  cuisineType: string;
  ingredients: RecipeIngredient[];
  instructions: string[];
  nutritionEstimate: NutritionInfo;
  cookingTips: string[];
}

export interface RecipeRequest {
  ingredients: string[];
  cuisineType?: string;
  dietaryRestrictions?: string[];
  servings?: number;
  difficulty?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
