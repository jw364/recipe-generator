import { Settings } from 'lucide-react';
import type { RecipeOptions as RecipeOptionsType } from '../types/recipe';

interface RecipeOptionsProps {
  options: RecipeOptionsType;
  onChange: (options: RecipeOptionsType) => void;
}

const CUISINE_TYPES = [
  '', 'American', 'Chinese', 'French', 'Greek', 'Indian',
  'Italian', 'Japanese', 'Korean', 'Lebanese', 'Mediterranean',
  'Mexican', 'Moroccan', 'Spanish', 'Thai', 'Vietnamese',
];

const DIETARY_OPTIONS = [
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'gluten-free', label: 'Gluten-Free' },
  { value: 'dairy-free', label: 'Dairy-Free' },
  { value: 'nut-free', label: 'Nut-Free' },
  { value: 'low-carb', label: 'Low-Carb' },
  { value: 'keto', label: 'Keto' },
  { value: 'paleo', label: 'Paleo' },
];

const DIFFICULTY_LEVELS = [
  { value: '', label: 'Any difficulty' },
  { value: 'Easy', label: 'Easy' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Hard', label: 'Hard' },
];

export default function RecipeOptions({ options, onChange }: RecipeOptionsProps) {
  const handleDietaryToggle = (value: string) => {
    const updated = options.dietaryRestrictions.includes(value)
      ? options.dietaryRestrictions.filter((d) => d !== value)
      : [...options.dietaryRestrictions, value];
    onChange({ ...options, dietaryRestrictions: updated });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-violet-100 dark:bg-violet-900/40 rounded-lg flex items-center justify-center">
          <Settings className="w-4 h-4 text-violet-600 dark:text-violet-400" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Preferences</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">Optional — customize your recipe</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Cuisine & Servings row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Cuisine Type
            </label>
            <select
              value={options.cuisineType}
              onChange={(e) => onChange({ ...options, cuisineType: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all appearance-none cursor-pointer"
            >
              {CUISINE_TYPES.map((cuisine) => (
                <option key={cuisine} value={cuisine}>
                  {cuisine || 'Any cuisine'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Servings
            </label>
            <input
              type="number"
              min={1}
              max={12}
              value={options.servings}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (!isNaN(val) && val >= 1 && val <= 12) {
                  onChange({ ...options, servings: val });
                }
              }}
              className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Difficulty Level
          </label>
          <div className="flex gap-2">
            {DIFFICULTY_LEVELS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => onChange({ ...options, difficulty: value })}
                className={`flex-1 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                  options.difficulty === value
                    ? 'bg-emerald-500 border-emerald-500 text-white'
                    : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Dietary restrictions */}
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Dietary Restrictions
          </label>
          <div className="flex flex-wrap gap-1.5">
            {DIETARY_OPTIONS.map(({ value, label }) => {
              const isSelected = options.dietaryRestrictions.includes(value);
              return (
                <button
                  key={value}
                  onClick={() => handleDietaryToggle(value)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-full border transition-colors ${
                    isSelected
                      ? 'bg-violet-500 border-violet-500 text-white'
                      : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-violet-400 hover:text-violet-600 dark:hover:text-violet-400'
                  }`}
                >
                  {isSelected ? '✓ ' : ''}{label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
