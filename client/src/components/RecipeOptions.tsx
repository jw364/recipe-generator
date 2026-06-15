import { SlidersHorizontal } from 'lucide-react';
import type { RecipeOptions as RecipeOptionsType } from '../types/recipe';

interface RecipeOptionsProps {
  options: RecipeOptionsType;
  onChange: (options: RecipeOptionsType) => void;
}

const CUISINES = [
  '', 'American', 'Chinese', 'French', 'Greek', 'Indian', 'Italian',
  'Japanese', 'Korean', 'Lebanese', 'Mediterranean', 'Mexican',
  'Moroccan', 'Spanish', 'Thai', 'Vietnamese',
];

const DIETARY = [
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'gluten-free', label: 'Gluten-Free' },
  { value: 'dairy-free', label: 'Dairy-Free' },
  { value: 'nut-free', label: 'Nut-Free' },
  { value: 'low-carb', label: 'Low-Carb' },
  { value: 'keto', label: 'Keto' },
  { value: 'paleo', label: 'Paleo' },
];

const DIFFICULTIES = [
  { value: '', label: 'Any' },
  { value: 'Easy', label: 'Easy' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Hard', label: 'Hard' },
];

export default function RecipeOptions({ options, onChange }: RecipeOptionsProps) {
  const toggleDietary = (value: string) => {
    const updated = options.dietaryRestrictions.includes(value)
      ? options.dietaryRestrictions.filter(d => d !== value)
      : [...options.dietaryRestrictions, value];
    onChange({ ...options, dietaryRestrictions: updated });
  };

  return (
    <div className="card p-5">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 bg-brand-50 dark:bg-brand-900 rounded-lg flex items-center justify-center">
          <SlidersHorizontal className="w-4 h-4 text-brand" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-warm-100">Preferences</h2>
          <p className="text-xs text-warm-400">Optional — customize your recipe</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Cuisine + Servings */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-warm-300 mb-1.5">Cuisine</label>
            <select
              value={options.cuisineType}
              onChange={e => onChange({ ...options, cuisineType: e.target.value })}
              className="select"
            >
              {CUISINES.map(c => (
                <option key={c} value={c}>{c || 'Any cuisine'}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-warm-300 mb-1.5">Servings</label>
            <input
              type="number" min={1} max={12}
              value={options.servings}
              onChange={e => {
                const v = parseInt(e.target.value, 10);
                if (!isNaN(v) && v >= 1 && v <= 12) onChange({ ...options, servings: v });
              }}
              className="input"
            />
          </div>
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-warm-300 mb-1.5">Difficulty</label>
          <div className="flex gap-2">
            {DIFFICULTIES.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => onChange({ ...options, difficulty: value })}
                className={`flex-1 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                  options.difficulty === value
                    ? 'bg-brand border-brand text-white shadow-brand'
                    : 'bg-white dark:bg-brand-950 border-warm-200 dark:border-brand-800 text-warm-500 dark:text-brand-400 hover:border-brand-300 hover:text-brand'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Dietary */}
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-warm-300 mb-1.5">Dietary Restrictions</label>
          <div className="flex flex-wrap gap-1.5">
            {DIETARY.map(({ value, label }) => {
              const selected = options.dietaryRestrictions.includes(value);
              return (
                <button
                  key={value}
                  onClick={() => toggleDietary(value)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-full border transition-colors ${
                    selected
                      ? 'bg-brand border-brand text-white'
                      : 'bg-white dark:bg-brand-950 border-warm-200 dark:border-brand-800 text-warm-500 dark:text-brand-400 hover:border-brand-300 hover:text-brand'
                  }`}
                >
                  {selected ? '✓ ' : ''}{label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
