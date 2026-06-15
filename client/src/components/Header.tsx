import { Moon, Sun, History, Github, Cherry } from 'lucide-react';
import type { Theme } from '../types/recipe';

interface HeaderProps {
  theme: Theme;
  onToggleTheme: () => void;
  historyCount: number;
  onOpenHistory: () => void;
}

export default function Header({ theme, onToggleTheme, historyCount, onOpenHistory }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-blossom-950/90 backdrop-blur-md border-b border-blossom-200 dark:border-blossom-900 no-print">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blossom-gradient rounded-xl flex items-center justify-center shadow-blossom flex-shrink-0">
            <Cherry className="w-5 h-5 text-rose-700" />
          </div>
          <span className="text-lg font-bold text-rose-800 dark:text-blossom-200 tracking-tight">
            Blossom Market
          </span>
        </div>

        {/* Nav */}
        <nav className="flex items-center gap-1">
          <button
            onClick={onOpenHistory}
            className="relative flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-rose-600 dark:text-blossom-300 hover:bg-blossom-100 dark:hover:bg-blossom-900 rounded-lg transition-colors"
          >
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">History</span>
            {historyCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-blossom-300 text-rose-800 text-xs rounded-full flex items-center justify-center font-bold">
                {historyCount > 9 ? '9+' : historyCount}
              </span>
            )}
          </button>

          <button
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            className="w-9 h-9 flex items-center justify-center text-rose-500 dark:text-blossom-300 hover:bg-blossom-100 dark:hover:bg-blossom-900 rounded-lg transition-colors"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View on GitHub"
            className="w-9 h-9 flex items-center justify-center text-rose-500 dark:text-blossom-300 hover:bg-blossom-100 dark:hover:bg-blossom-900 rounded-lg transition-colors"
          >
            <Github className="w-4 h-4" />
          </a>
        </nav>
      </div>
    </header>
  );
}
