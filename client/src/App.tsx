import { useState, useCallback } from 'react';
import { Toaster } from 'react-hot-toast';
import { ChefHat, Sparkles } from 'lucide-react';
import Header from './components/Header';
import IngredientInput from './components/IngredientInput';
import RecipeOptions from './components/RecipeOptions';
import RecipeDisplay from './components/RecipeDisplay';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import RecipeHistory from './components/RecipeHistory';
import { useTheme } from './hooks/useTheme';
import { useRecipeGenerator } from './hooks/useRecipeGenerator';
import { useRecipeHistory } from './hooks/useRecipeHistory';
import type { RecipeOptions as RecipeOptionsType, Recipe } from './types/recipe';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const { recipe, loading, error, generateRecipe, clearRecipe } = useRecipeGenerator();
  const { history, addToHistory, removeFromHistory, clearHistory } = useRecipeHistory();

  const [ingredients, setIngredients] = useState<string[]>([]);
  const [options, setOptions] = useState<RecipeOptionsType>({
    cuisineType: '',
    dietaryRestrictions: [],
    servings: 4,
    difficulty: '',
  });
  const [showHistory, setShowHistory] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<{ ingredients: string[]; options: RecipeOptionsType } | null>(null);

  const handleGenerate = useCallback(async () => {
    if (ingredients.length === 0) return;
    const req = { ingredients, ...options };
    setCurrentRequest({ ingredients, options });
    const result = await generateRecipe(req);
    if (result) {
      addToHistory(result);
    }
  }, [ingredients, options, generateRecipe, addToHistory]);

  const handleRetry = useCallback(async () => {
    if (!currentRequest) return;
    const result = await generateRecipe({ ...currentRequest.ingredients, ...currentRequest.options, ingredients: currentRequest.ingredients });
    if (result) {
      addToHistory(result);
    }
  }, [currentRequest, generateRecipe, addToHistory]);

  const handleLoadFromHistory = useCallback((_savedRecipe: Recipe) => {
    setShowHistory(false);
    // Recipe is already displayed — user would need to regenerate;
    // for simplicity just close the panel.
  }, []);

  const showForm = !recipe && !loading && !error;

  return (
    <div className={theme}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: theme === 'dark' ? '#1f2937' : '#fff',
              color: theme === 'dark' ? '#f9fafb' : '#111827',
              border: theme === 'dark' ? '1px solid #374151' : '1px solid #e5e7eb',
              borderRadius: '12px',
              fontSize: '14px',
            },
          }}
        />

        <Header
          theme={theme}
          onToggleTheme={toggleTheme}
          historyCount={history.length}
          onOpenHistory={() => setShowHistory(true)}
        />

        <main className="max-w-6xl mx-auto px-4 py-8 pb-16">
          {showForm && (
            <div className="animate-fade-in">
              {/* Hero */}
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 rounded-2xl shadow-xl shadow-emerald-500/30 mb-5 animate-bounce-gentle">
                  <ChefHat className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                  What's in Your Kitchen?
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg max-w-xl mx-auto">
                  Tell us the ingredients you have on hand and our AI chef will create a delicious, personalized recipe for you.
                </p>
              </div>

              {/* Two-column form */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
                <IngredientInput
                  ingredients={ingredients}
                  onAdd={(ingredient) => setIngredients((prev) => [...prev, ingredient])}
                  onRemove={(ingredient) => setIngredients((prev) => prev.filter((i) => i !== ingredient))}
                  onClear={() => setIngredients([])}
                />
                <RecipeOptions options={options} onChange={setOptions} />
              </div>

              {/* Generate button */}
              <div className="flex justify-center">
                <button
                  onClick={handleGenerate}
                  disabled={ingredients.length === 0}
                  className={`
                    flex items-center gap-2.5 px-8 py-3.5 text-base font-semibold rounded-2xl transition-all duration-200
                    shadow-lg shadow-emerald-500/30
                    ${
                      ingredients.length === 0
                        ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed shadow-none'
                        : 'bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-white hover:shadow-xl hover:shadow-emerald-500/40'
                    }
                  `}
                >
                  <Sparkles className="w-5 h-5" />
                  Generate Recipe
                  {ingredients.length > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded-md text-sm font-normal">
                      {ingredients.length} ingredient{ingredients.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </button>
              </div>

              {ingredients.length === 0 && (
                <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-3">
                  Add at least one ingredient to get started
                </p>
              )}
            </div>
          )}

          {loading && <LoadingState />}

          {error && !loading && (
            <ErrorState
              error={error}
              onRetry={handleRetry}
              onBack={clearRecipe}
            />
          )}

          {recipe && !loading && !error && (
            <RecipeDisplay recipe={recipe} onBack={clearRecipe} />
          )}
        </main>

        {showHistory && (
          <RecipeHistory
            history={history}
            onLoad={handleLoadFromHistory}
            onRemove={removeFromHistory}
            onClear={clearHistory}
            onClose={() => setShowHistory(false)}
          />
        )}
      </div>
    </div>
  );
}
