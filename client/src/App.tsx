import { useState, useCallback } from 'react';
import { Toaster } from 'react-hot-toast';
import { Cherry, Sparkles } from 'lucide-react';
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
    cuisineType: '', dietaryRestrictions: [], servings: 4, difficulty: '',
  });
  const [showHistory, setShowHistory] = useState(false);
  const [lastRequest, setLastRequest] = useState<{ ingredients: string[]; options: RecipeOptionsType } | null>(null);

  const handleGenerate = useCallback(async () => {
    if (ingredients.length === 0) return;
    setLastRequest({ ingredients, options });
    const result = await generateRecipe({ ingredients, ...options });
    if (result) addToHistory(result);
  }, [ingredients, options, generateRecipe, addToHistory]);

  const handleRetry = useCallback(async () => {
    if (!lastRequest) return;
    const result = await generateRecipe({ ingredients: lastRequest.ingredients, ...lastRequest.options });
    if (result) addToHistory(result);
  }, [lastRequest, generateRecipe, addToHistory]);

  const handleLoadFromHistory = useCallback((_r: Recipe) => {
    setShowHistory(false);
  }, []);

  const showForm = !recipe && !loading && !error;

  return (
    <div className={theme}>
      <div className="min-h-screen bg-white dark:bg-blossom-950 transition-colors duration-300">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: theme === 'dark' ? '#420707' : '#fff',
              color: theme === 'dark' ? '#ffeeee' : '#1a0505',
              border: `1px solid #FFBDBD`,
              borderRadius: '12px',
              fontSize: '14px',
              boxShadow: '0 4px 14px rgba(255, 189, 189, 0.3)',
            },
          }}
        />

        <Header theme={theme} onToggleTheme={toggleTheme} historyCount={history.length} onOpenHistory={() => setShowHistory(true)} />

        <main className="max-w-6xl mx-auto px-4 py-10 pb-20">
          {showForm && (
            <div className="animate-fade-in">
              {/* Hero */}
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blossom-gradient rounded-2xl shadow-blossom-md mb-5 animate-bounce-gentle">
                  <Cherry className="w-8 h-8 text-rose-600" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-blossom-100 mb-3">
                  What's in Your Kitchen?
                </h1>
                <p className="text-rose-300 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
                  Tell us the ingredients you have on hand. Blossom Market will craft the best possible recipe — no need to use every ingredient.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-7">
                <IngredientInput
                  ingredients={ingredients}
                  onAdd={i => setIngredients(prev => [...prev, i])}
                  onRemove={i => setIngredients(prev => prev.filter(x => x !== i))}
                  onClear={() => setIngredients([])}
                />
                <RecipeOptions options={options} onChange={setOptions} />
              </div>

              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={handleGenerate}
                  disabled={ingredients.length === 0}
                  className="btn-primary text-base px-8 py-3.5 rounded-2xl"
                >
                  <Sparkles className="w-5 h-5" />
                  Generate Recipe
                  {ingredients.length > 0 && (
                    <span className="ml-1 px-2 py-0.5 bg-white/40 rounded-lg text-sm font-normal border border-blossom-300">
                      {ingredients.length} ingredient{ingredients.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </button>
                {ingredients.length === 0 && (
                  <p className="text-xs text-rose-200 dark:text-blossom-700">Add at least one ingredient to get started</p>
                )}
                {ingredients.length > 0 && (
                  <p className="text-xs text-rose-300">The AI will select the best combination — unused ingredients will be listed</p>
                )}
              </div>
            </div>
          )}

          {loading && <LoadingState />}
          {error && !loading && <ErrorState error={error} onRetry={handleRetry} onBack={clearRecipe} />}
          {recipe && !loading && !error && <RecipeDisplay recipe={recipe} onBack={clearRecipe} />}
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
