import { ArrowLeft, Clock, Users, Cherry, Zap, CheckCircle2, Lightbulb, Flame, PackageX, Sparkles } from 'lucide-react';
import ExportMenu from './ExportMenu';
import type { Recipe } from '../types/recipe';

interface RecipeDisplayProps {
  recipe: Recipe;
  onBack: () => void;
}

const DIFFICULTY_STYLE: Record<string, string> = {
  Easy:   'bg-green-50 text-green-700 border-green-200',
  Medium: 'bg-amber-50 text-amber-700 border-amber-200',
  Hard:   'bg-red-50 text-red-700 border-red-200',
};

export default function RecipeDisplay({ recipe, onBack }: RecipeDisplayProps) {
  const diffStyle = DIFFICULTY_STYLE[recipe.difficulty] ?? 'bg-blossom-100 text-rose-600 border-blossom-200';
  const unusedList = recipe.unusedIngredients ?? [];
  const recommended = recipe.recommendedIngredients ?? [];

  return (
    <div className="animate-slide-up max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-5 no-print">
        <button onClick={onBack} className="btn-ghost text-sm"><ArrowLeft className="w-4 h-4" /> New Recipe</button>
        <ExportMenu recipe={recipe} />
      </div>

      <div className="recipe-card bg-white rounded-2xl border border-blossom-200 shadow-blossom-md overflow-hidden">

        {/* Hero */}
        <div className="bg-blossom-gradient p-6 pb-7 relative overflow-hidden">
          <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/20" />
          <div className="absolute -bottom-8 -left-4 w-24 h-24 rounded-full bg-white/20" />
          <div className="relative flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-1.5 mb-2">
                {recipe.cuisineType && (
                  <span className="px-2.5 py-0.5 bg-white/40 text-rose-800 text-xs font-medium rounded-full border border-white/40">
                    {recipe.cuisineType}
                  </span>
                )}
                {recipe.difficulty && (
                  <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${diffStyle}`}>
                    {recipe.difficulty}
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-rose-900 mb-2 leading-tight">{recipe.title}</h1>
              <p className="text-rose-700 text-sm leading-relaxed">{recipe.description}</p>
            </div>
            <div className="w-11 h-11 bg-white/30 rounded-xl flex items-center justify-center flex-shrink-0 border border-white/40">
              <Cherry className="w-6 h-6 text-rose-700" />
            </div>
          </div>
        </div>

        {/* Meta strip */}
        <div className="grid grid-cols-4 divide-x divide-blossom-100 border-b border-blossom-100 bg-blossom-50">
          {[
            { icon: Clock, label: 'Prep',   value: recipe.prepTime },
            { icon: Flame, label: 'Cook',   value: recipe.cookTime },
            { icon: Zap,   label: 'Total',  value: recipe.totalTime },
            { icon: Users, label: 'Serves', value: String(recipe.servings) },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex flex-col items-center py-3 px-2">
              <Icon className="w-4 h-4 text-rose-400 mb-1" />
              <span className="text-xs text-rose-300">{label}</span>
              <span className="text-sm font-semibold text-gray-900 mt-0.5">{value}</span>
            </div>
          ))}
        </div>

        <div className="p-6 space-y-8">

          {/* Ingredients */}
          <section>
            <h2 className="section-title">
              <span className="section-icon bg-blossom-100 text-rose-500 text-xs">I</span>
              Ingredients
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {recipe.ingredients.map((ing, i) => (
                <li key={i} className="flex items-start gap-2 p-2.5 bg-blossom-50 rounded-xl border border-blossom-100">
                  <CheckCircle2 className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">
                    <span className="font-medium text-gray-900">{[ing.amount, ing.unit].filter(Boolean).join(' ')}</span>
                    {' '}{ing.name}
                    {ing.notes && <span className="text-rose-300 ml-1">({ing.notes})</span>}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Instructions */}
          <section>
            <h2 className="section-title">
              <span className="section-icon bg-blue-50 text-blue-500 text-xs">S</span>
              Instructions
            </h2>
            <ol className="space-y-3">
              {recipe.instructions.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blossom-200 text-rose-800 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-sm text-gray-700 leading-relaxed">{step}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* Nutrition */}
          <section>
            <h2 className="section-title">
              <span className="section-icon bg-violet-50 text-violet-500 text-xs">N</span>
              Nutrition Estimate
              <span className="text-xs font-normal text-rose-300 ml-1">per serving</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { label: 'Calories', value: recipe.nutritionEstimate.calories, cls: 'bg-orange-50 text-orange-700 border-orange-100' },
                { label: 'Protein',  value: recipe.nutritionEstimate.protein,  cls: 'bg-red-50 text-red-700 border-red-100' },
                { label: 'Carbs',    value: recipe.nutritionEstimate.carbohydrates, cls: 'bg-amber-50 text-amber-700 border-amber-100' },
                { label: 'Fat',      value: recipe.nutritionEstimate.fat,      cls: 'bg-purple-50 text-purple-700 border-purple-100' },
                { label: 'Fiber',    value: recipe.nutritionEstimate.fiber,    cls: 'bg-green-50 text-green-700 border-green-100' },
              ].map(({ label, value, cls }) => (
                <div key={label} className={`${cls} border rounded-xl p-3 text-center`}>
                  <p className="text-lg font-bold">{value}</p>
                  <p className="text-xs opacity-70 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Cooking Tips */}
          {recipe.cookingTips.length > 0 && (
            <section>
              <h2 className="section-title">
                <span className="section-icon bg-amber-50 text-amber-500"><Lightbulb className="w-3.5 h-3.5" /></span>
                Cooking Tips
              </h2>
              <ul className="space-y-2">
                {recipe.cookingTips.map((tip, i) => (
                  <li key={i} className="flex gap-2.5 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                    <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-800">{tip}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Recommended Additions */}
          {recommended.length > 0 && (
            <section>
              <h2 className="section-title">
                <span className="section-icon bg-blossom-200 text-rose-600"><Sparkles className="w-3.5 h-3.5" /></span>
                Recommended Additions
                <span className="text-xs font-normal text-rose-300 ml-1">would elevate this dish</span>
              </h2>
              <ul className="space-y-2">
                {recommended.map((rec, i) => (
                  <li key={i} className="flex items-start gap-3 p-3.5 bg-blossom-50 border border-blossom-200 rounded-xl">
                    <div className="w-7 h-7 bg-blossom-gradient rounded-lg flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-0.5">
                        <span className="text-sm font-semibold text-rose-700">{rec.name}</span>
                        <span className="text-xs text-rose-400 font-medium">{rec.quantity}</span>
                      </div>
                      <p className="text-xs text-rose-500 leading-relaxed">{rec.reason}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Unused Ingredients */}
          {unusedList.length > 0 && (
            <section>
              <h2 className="section-title">
                <span className="section-icon bg-blossom-100 text-rose-300"><PackageX className="w-3.5 h-3.5" /></span>
                Unused Available Ingredients
                <span className="text-xs font-normal text-rose-300 ml-1">not needed for this recipe</span>
              </h2>
              <div className="p-4 bg-blossom-50 border border-blossom-200 rounded-xl">
                <p className="text-xs text-rose-300 mb-2.5">These ingredients from your list weren't a natural fit for this dish:</p>
                <div className="flex flex-wrap gap-2">
                  {unusedList.map((ing, i) => (
                    <span key={i} className="tag-muted"><PackageX className="w-3 h-3" />{ing}</span>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>

        <div className="px-6 py-3 border-t border-blossom-100 bg-blossom-50">
          <p className="text-xs text-rose-300">
            Generated on {new Date(recipe.generatedAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  );
}
