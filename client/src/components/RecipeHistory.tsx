import { useEffect, useRef } from 'react';
import { X, Trash2, Clock, Cherry, RotateCcw } from 'lucide-react';
import type { Recipe } from '../types/recipe';

interface RecipeHistoryProps {
  history: Recipe[];
  onLoad: (recipe: Recipe) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  onClose: () => void;
}

export default function RecipeHistory({ history, onLoad, onRemove, onClear, onClose }: RecipeHistoryProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const formatDate = (iso: string) => {
    try {
      return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(iso));
    } catch { return iso; }
  };

  return (
    <>
      <div className="fixed inset-0 bg-rose-950/20 backdrop-blur-sm z-50 animate-fade-in no-print" onClick={onClose} aria-hidden="true" />
      <div ref={panelRef} role="dialog" aria-modal="true" aria-label="Recipe History" className="fixed right-0 top-0 h-full w-full max-w-sm bg-white dark:bg-blossom-950 shadow-blossom-lg z-50 flex flex-col no-print">
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-blossom-100 dark:border-blossom-900">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-rose-400" />
            <h2 className="text-sm font-semibold text-gray-900 dark:text-blossom-100">Recipe History</h2>
            <span className="px-1.5 py-0.5 bg-blossom-100 dark:bg-blossom-900 text-rose-600 text-xs rounded-md font-medium">{history.length}</span>
          </div>
          <div className="flex items-center gap-1">
            {history.length > 0 && (
              <button onClick={onClear} className="p-1.5 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Clear all">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button onClick={onClose} className="p-1.5 text-rose-300 hover:bg-blossom-100 dark:hover:bg-blossom-900 rounded-lg transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-3">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-16 text-center">
              <Cherry className="w-10 h-10 text-blossom-200 dark:text-blossom-800 mb-3" />
              <p className="text-sm font-medium text-rose-300">No recipes yet</p>
              <p className="text-xs text-blossom-300 dark:text-blossom-700 mt-1">Generated recipes will appear here</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {history.map(recipe => (
                <li key={recipe.id}>
                  <div className="group flex items-start gap-3 p-3 bg-blossom-50 dark:bg-blossom-900/50 hover:bg-blossom-100 dark:hover:bg-blossom-900 border border-blossom-100 dark:border-blossom-800 hover:border-blossom-300 rounded-xl transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-blossom-100 truncate">{recipe.title}</p>
                      <p className="text-xs text-rose-300 mt-0.5">{recipe.cuisineType || 'Recipe'} • {recipe.totalTime} • {formatDate(recipe.generatedAt)}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => onLoad(recipe)} className="p-1.5 text-rose-400 hover:bg-blossom-200 rounded-lg transition-colors" title="Load">
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => onRemove(recipe.id)} className="p-1.5 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Delete">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
