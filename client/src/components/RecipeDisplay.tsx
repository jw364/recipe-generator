import { ArrowLeft, Clock, Users, ChefHat, Zap, CheckCircle2, Lightbulb, Flame } from 'lucide-react';
import ExportMenu from './ExportMenu';
import type { Recipe } from '../types/recipe';

interface RecipeDisplayProps {
  recipe: Recipe;
  onBack: () => void;
}

export default function RecipeDisplay({ recipe, onBack }: RecipeDisplayProps) {
  const difficultyColor = {
    Easy: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-400',
    Medium: 'text-amber-600 bg-amber-100 dark:bg-amber-900/40 dark:text-amber-400',
    Hard: 'text-red-600 bg-red-100 dark:bg-red-900/40 dark:text-red-400',
  }[recipe.difficulty] ?? 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-400';

  return (
    <div className="animate-slide-up max-w-3xl mx-auto">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-5 no-print">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          New Recipe
        </button>
        <ExportMenu recipe={recipe} />
      </div>

      {/* Recipe card */}
      <div className="recipe-card bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 pb-8">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {recipe.cuisineType && (
                  <span className="px-2 py-0.5 bg-white/20 text-white text-xs font-medium rounded-full">
                    {recipe.cuisineType}
                  </span>
                )}
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${difficultyColor}`}>
                  {recipe.difficulty}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white mb-1">{recipe.title}</h1>
              <p className="text-emerald-100 text-sm leading-relaxed">{recipe.description}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Time/Servings badges */}
        <div className="grid grid-cols-4 divide-x divide-gray-100 dark:divide-gray-700 border-b border-gray-100 dark:border-gray-700">
          {[
            { icon: Clock, label: 'Prep', value: recipe.prepTime },
            { icon: Flame, label: 'Cook', value: recipe.cookTime },
            { icon: Zap, label: 'Total', value: recipe.totalTime },
            { icon: Users, label: 'Serves', value: recipe.servings.toString() },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex flex-col items-center py-3 px-2">
              <Icon className="w-4 h-4 text-emerald-500 mb-1" />
              <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">{value}</span>
            </div>
          ))}
        </div>

        <div className="p-6 space-y-7">
          {/* Ingredients */}
          <section>
            <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <span className="w-6 h-6 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-xs font-bold">I</span>
              Ingredients
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {recipe.ingredients.map((ingredient, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 p-2.5 bg-gray-50 dark:bg-gray-900/50 rounded-xl"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {[ingredient.amount, ingredient.unit].filter(Boolean).join(' ')}
                    </span>
                    {' '}
                    {ingredient.name}
                    {ingredient.notes && (
                      <span className="text-gray-400 dark:text-gray-500 ml-1">({ingredient.notes})</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Instructions */}
          <section>
            <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 text-xs font-bold">S</span>
              Instructions
            </h2>
            <ol className="space-y-3">
              {recipe.instructions.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{step}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* Nutrition */}
          <section>
            <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <span className="w-6 h-6 bg-violet-100 dark:bg-violet-900/40 rounded-lg flex items-center justify-center text-violet-600 dark:text-violet-400 text-xs font-bold">N</span>
              Nutrition Estimate
              <span className="text-xs font-normal text-gray-400 dark:text-gray-500">per serving</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { label: 'Calories', value: recipe.nutritionEstimate.calories, color: 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400' },
                { label: 'Protein', value: recipe.nutritionEstimate.protein, color: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' },
                { label: 'Carbs', value: recipe.nutritionEstimate.carbohydrates, color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' },
                { label: 'Fat', value: recipe.nutritionEstimate.fat, color: 'bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400' },
                { label: 'Fiber', value: recipe.nutritionEstimate.fiber, color: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' },
              ].map(({ label, value, color }) => (
                <div key={label} className={`${color} rounded-xl p-3 text-center`}>
                  <p className="text-lg font-bold">{value}</p>
                  <p className="text-xs opacity-75 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Cooking tips */}
          {recipe.cookingTips.length > 0 && (
            <section>
              <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-amber-100 dark:bg-amber-900/40 rounded-lg flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <Lightbulb className="w-3.5 h-3.5" />
                </span>
                Cooking Tips
              </h2>
              <ul className="space-y-2">
                {recipe.cookingTips.map((tip, i) => (
                  <li key={i} className="flex gap-2.5 p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-xl">
                    <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-800 dark:text-amber-300">{tip}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <div className="px-6 py-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <p className="text-xs text-gray-400 dark:text-gray-600">
            Generated on {new Date(recipe.generatedAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  );
}
