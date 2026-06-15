import { useState, KeyboardEvent, useRef } from 'react';
import { Plus, X, Trash2, Leaf } from 'lucide-react';

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
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blossom-100 dark:bg-blossom-900 rounded-lg flex items-center justify-center">
            <Leaf className="w-4 h-4 text-rose-500" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-blossom-100">Ingredients</h2>
            <p className="text-xs text-rose-300">Add what you have on hand</p>
          </div>
        </div>
        {ingredients.length > 0 && (
          <button onClick={onClear} className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-600 transition-colors">
            <Trash2 className="w-3 h-3" /> Clear all
          </button>
        )}
      </div>

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
          className="w-10 h-10 flex items-center justify-center bg-blossom-200 hover:bg-blossom-300 text-rose-700 rounded-xl transition-colors shadow-blossom-sm border border-blossom-300 flex-shrink-0"
          aria-label="Add ingredient"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      {error && <p className="text-xs text-rose-500 mb-2">{error}</p>}

      {ingredients.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3" role="list">
          {ingredients.map(ingredient => (
            <span key={ingredient} role="listitem" className="tag-blossom animate-fade-in">
              {ingredient}
              <button
                onClick={() => onRemove(ingredient)}
                className="w-3.5 h-3.5 flex items-center justify-center rounded-full hover:bg-blossom-300 transition-colors"
                aria-label={`Remove ${ingredient}`}
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div>
        <p className="text-xs text-rose-300 mb-1.5">Quick add:</p>
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
                    ? 'bg-blossom-100 border-blossom-200 text-rose-300 cursor-not-allowed'
                    : 'bg-white border-blossom-200 text-rose-400 hover:border-blossom-300 hover:bg-blossom-100 hover:text-rose-600'
                }`}
              >
                {added ? '✓ ' : '+ '}{s}
              </button>
            );
          })}
        </div>
      </div>

      {ingredients.length > 0 && (
        <p className="mt-3 text-xs text-rose-300">
          {ingredients.length} ingredient{ingredients.length !== 1 ? 's' : ''} added
        </p>
      )}
    </div>
  );
}
