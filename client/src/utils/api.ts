import axios from 'axios';
import type { Recipe, RecipeRequest } from '../types/recipe';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function generateRecipe(request: RecipeRequest): Promise<Recipe> {
  const response = await apiClient.post<{ success: boolean; data: Recipe; error?: string }>(
    '/api/recipe/generate',
    request
  );

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error ?? 'Failed to generate recipe');
  }

  return {
    ...response.data.data,
    id: crypto.randomUUID(),
    generatedAt: new Date().toISOString(),
  };
}
