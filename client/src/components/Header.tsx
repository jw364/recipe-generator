import { ChefHat, Moon, Sun, History, Github } from 'lucide-react';
import type { Theme } from '../types/recipe';

interface HeaderProps {
  theme: Theme;
  onToggleTheme: () => void;
  historyCount: number;
  onOpenHistory: () => void;
}

export default function Header({ theme, onToggleTheme, historyCount, onOpenHistory }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-brand-950/90 backdrop-blur-md border-b border-warm-200 dark:border-brand-900 no-print">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-brand-gradient rounded-xl flex items-center justify-center shadow-brand flex-shrink-0">
            <ChefHat className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-base font-bold text-brand leading-tight block">Recipe Generator</span>
            <span className="text-xs text-warm-400 leading-tight block">AI-Powered</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex items-center gap-1">
          <button
            onClick={onOpenHistory}
            className="relative flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-brand-600 dark:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-900 rounded-lg transition-colors"
          >
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">History</span>
            {historyCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand text-white text-xs rounded-full flex items-center justify-center font-bold">
                {historyCount > 9 ? '9+' : historyCount}
              </span>
            )}
          </button>

          <button
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            className="w-9 h-9 flex items-center justify-center text-brand-500 dark:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-900 rounded-lg transition-colors"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View source on GitHub"
            className="w-9 h-9 flex items-center justify-center text-brand-500 dark:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-900 rounded-lg transition-colors"
          >
            <Github className="w-4 h-4" />
          </a>
        </nav>
      </div>
    </header>
  );
}
