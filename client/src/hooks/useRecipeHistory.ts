import { useState, useCallback } from 'react';
import type { Recipe } from '../types/recipe';

const STORAGE_KEY = 'recipe-generator-history';
const MAX_HISTORY = 20;

function loadHistory(): Recipe[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Recipe[]) : [];
  } catch {
    return [];
  }
}

function saveHistory(history: Recipe[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {
    // localStorage full — silently skip
  }
}

export function useRecipeHistory() {
  const [history, setHistory] = useState<Recipe[]>(loadHistory);

  const addToHistory = useCallback((recipe: Recipe) => {
    setHistory((prev) => {
      const filtered = prev.filter((r) => r.id !== recipe.id);
      const updated = [recipe, ...filtered].slice(0, MAX_HISTORY);
      saveHistory(updated);
      return updated;
    });
  }, []);

  const removeFromHistory = useCallback((id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      saveHistory(updated);
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { history, addToHistory, removeFromHistory, clearHistory };
}
