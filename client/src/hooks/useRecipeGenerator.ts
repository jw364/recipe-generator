import { useState, useCallback } from 'react';
import type { Recipe, RecipeRequest } from '../types/recipe';
import { generateRecipe as apiGenerateRecipe } from '../utils/api';

interface UseRecipeGeneratorReturn {
  recipe: Recipe | null;
  loading: boolean;
  error: string | null;
  generateRecipe: (request: RecipeRequest) => Promise<Recipe | null>;
  clearRecipe: () => void;
  clearError: () => void;
}

export function useRecipeGenerator(): UseRecipeGeneratorReturn {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateRecipe = useCallback(async (request: RecipeRequest): Promise<Recipe | null> => {
    setLoading(true);
    setError(null);
    setRecipe(null);

    try {
      const result = await apiGenerateRecipe(request);
      setRecipe(result);
      return result;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearRecipe = useCallback(() => {
    setRecipe(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { recipe, loading, error, generateRecipe, clearRecipe, clearError };
}
