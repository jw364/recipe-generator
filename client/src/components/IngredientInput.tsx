import { useState, KeyboardEvent, useRef } from 'react';
import { Plus, X, Trash2, ChefHat } from 'lucide-react';

interface IngredientInputProps {
  ingredients: string[];
  onAdd: (ingredient: string) => void;
  onRemove: (ingredient: string) => void;
  onClear: () => void;
}

const SUGGESTED_INGREDIENTS = [
  'Chicken', 'Rice', 'Garlic', 'Onion', 'Tomato', 'Pasta',
  'Eggs', 'Butter', 'Olive oil', 'Lemon', 'Broccoli', 'Potato',
];

export default function IngredientInput({ ingredients, onAdd, onRemove, onClear }: IngredientInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) {
      setError('Please enter an ingredient.');
      return;
    }
    if (trimmed.length > 50) {
      setError('Ingredient name is too long (max 50 characters).');
      return;
    }
    const normalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
    if (ingredients.some((i) => i.toLowerCase() === normalized.toLowerCase())) {
      setError('This ingredient is already added.');
      return;
    }
    onAdd(normalized);
    setInputValue('');
    setError('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    } else if (e.key === 'Escape') {
      setInputValue('');
      setError('');
    }
  };

  const handleSuggestion = (suggestion: string) => {
    if (!ingredients.some((i) => i.toLowerCase() === suggestion.toLowerCase())) {
      onAdd(suggestion);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg flex items-center justify-center">
          <ChefHat className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Ingredients</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">Add what you have on hand</p>
        </div>
        {ingredients.length > 0 && (
          <button
            onClick={onClear}
            className="ml-auto flex items-center gap-1 text-xs text-red-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            aria-label="Clear all ingredients"
          >
            <Trash2 className="w-3 h-3" />
            Clear all
          </button>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2 mb-2">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            if (error) setError('');
          }}
          onKeyDown={handleKeyDown}
          placeholder="e.g. Chicken, Rice, Garlic…"
          className="flex-1 px-3 py-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          aria-label="Ingredient name"
          aria-describedby={error ? 'ingredient-error' : undefined}
        />
        <button
          onClick={handleAdd}
          className="w-9 h-9 flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors shadow-sm shadow-emerald-500/30 flex-shrink-0"
          aria-label="Add ingredient"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {error && (
        <p id="ingredient-error" className="text-xs text-red-500 mb-2">
          {error}
        </p>
      )}

      {/* Tag list */}
      {ingredients.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3 min-h-[2rem]" role="list" aria-label="Added ingredients">
          {ingredients.map((ingredient) => (
            <span
              key={ingredient}
              role="listitem"
              className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-full text-xs font-medium animate-fade-in"
            >
              {ingredient}
              <button
                onClick={() => onRemove(ingredient)}
                className="w-3.5 h-3.5 flex items-center justify-center rounded-full hover:bg-emerald-200 dark:hover:bg-emerald-800 transition-colors"
                aria-label={`Remove ${ingredient}`}
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Suggestions */}
      <div>
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-1.5">Quick add:</p>
        <div className="flex flex-wrap gap-1">
          {SUGGESTED_INGREDIENTS.map((suggestion) => {
            const isAdded = ingredients.some((i) => i.toLowerCase() === suggestion.toLowerCase());
            return (
              <button
                key={suggestion}
                onClick={() => handleSuggestion(suggestion)}
                disabled={isAdded}
                className={`px-2 py-0.5 text-xs rounded-md border transition-colors ${
                  isAdded
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-600 border-gray-200 dark:border-gray-700 cursor-not-allowed'
                    : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer'
                }`}
              >
                {isAdded ? '✓ ' : '+ '}
                {suggestion}
              </button>
            );
          })}
        </div>
      </div>

      {/* Counter */}
      {ingredients.length > 0 && (
        <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">
          {ingredients.length} ingredient{ingredients.length !== 1 ? 's' : ''} added
        </p>
      )}
    </div>
  );
}
