import { useState, KeyboardEvent, useRef } from 'react';
import { Plus, X, Trash2, ChefHat } from 'lucide-react';

interface IngredientInputProps {
  ingredients: string[];
  onAdd: (ingredient: string) => void;
  onRemove: (ingredient: string) => void;
  onClear: () => void;
}

const SUGGESTED = [
  'Chicken', 'Rice', 'Garlic', 'Onion', 'Tomato', 'Pasta',
  'Eggs', 'Butter', 'Olive oil', 'Lemon', 'Broccoli', 'Potato',
];

export default function IngredientInput({ ingredients, onAdd, onRemove, onClear }: IngredientInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) { setError('Please enter an ingredient.'); return; }
    if (trimmed.length > 50) { setError('Max 50 characters.'); return; }
    const normalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    if (ingredients.some(i => i.toLowerCase() === normalized.toLowerCase())) {
      setError('Already added.'); return;
    }
    onAdd(normalized);
    setInputValue('');
    setError('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { e.preventDefault(); handleAdd(); }
    else if (e.key === 'Escape') { setInputValue(''); setError(''); }
  };

  return (
    <div className="card p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-brand-50 dark:bg-brand-900 rounded-lg flex items-center justify-center">
            <ChefHat className="w-4 h-4 text-brand" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-warm-100">Ingredients</h2>
            <p className="text-xs text-warm-400">Add what you have on hand</p>
          </div>
        </div>
        {ingredients.length > 0 && (
          <button onClick={onClear} className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 transition-colors">
            <Trash2 className="w-3 h-3" /> Clear all
          </button>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2 mb-1.5">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={e => { setInputValue(e.target.value); if (error) setError(''); }}
          onKeyDown={handleKeyDown}
          placeholder="e.g. Chicken, Rice, Garlic…"
          className="input flex-1"
          aria-label="Ingredient name"
        />
        <button
          onClick={handleAdd}
          className="w-10 h-10 flex items-center justify-center bg-brand hover:bg-brand-600 text-white rounded-xl transition-colors shadow-brand flex-shrink-0"
          aria-label="Add ingredient"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      {error && <p className="text-xs text-red-500 mb-2">{error}</p>}

      {/* Tags */}
      {ingredients.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3" role="list">
          {ingredients.map(ingredient => (
            <span key={ingredient} role="listitem" className="tag-brand animate-fade-in">
              {ingredient}
              <button
                onClick={() => onRemove(ingredient)}
                className="w-3.5 h-3.5 flex items-center justify-center rounded-full hover:bg-blush-200 transition-colors"
                aria-label={`Remove ${ingredient}`}
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Quick add */}
      <div>
        <p className="text-xs text-warm-400 mb-1.5">Quick add:</p>
        <div className="flex flex-wrap gap-1">
          {SUGGESTED.map(s => {
            const added = ingredients.some(i => i.toLowerCase() === s.toLowerCase());
            return (
              <button
                key={s}
                onClick={() => !added && onAdd(s)}
                disabled={added}
                className={`px-2 py-0.5 text-xs rounded-md border transition-colors ${
                  added
                    ? 'bg-warm-100 border-warm-200 text-warm-400 cursor-not-allowed dark:bg-brand-900 dark:border-brand-800 dark:text-brand-700'
                    : 'bg-white dark:bg-brand-950 border-warm-200 dark:border-brand-800 text-warm-500 dark:text-brand-400 hover:border-brand-300 hover:text-brand hover:bg-brand-50 dark:hover:bg-brand-900'
                }`}
              >
                {added ? '✓ ' : '+ '}{s}
              </button>
            );
          })}
        </div>
      </div>

      {ingredients.length > 0 && (
        <p className="mt-3 text-xs text-warm-400">
          {ingredients.length} ingredient{ingredients.length !== 1 ? 's' : ''} added
        </p>
      )}
    </div>
  );
}
