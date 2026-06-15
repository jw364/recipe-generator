import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
  onBack: () => void;
}

export default function ErrorState({ error, onRetry, onBack }: ErrorStateProps) {
  const isRateLimit = error.toLowerCase().includes('rate limit') || error.includes('429');
  const isAuth = error.toLowerCase().includes('api key') || error.includes('401') || error.includes('403');
  const isNetwork = error.toLowerCase().includes('network') || error.toLowerCase().includes('fetch') || error.includes('ECONNREFUSED');

  const getHint = () => {
    if (isRateLimit) return 'You have exceeded the API rate limit. Please wait a moment before trying again.';
    if (isAuth) return 'Your API key appears to be invalid or missing. Check the server configuration.';
    if (isNetwork) return 'Cannot reach the server. Make sure the backend is running on port 3001.';
    return 'Something went wrong while generating your recipe. Please try again.';
  };

  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mb-5">
        <AlertCircle className="w-8 h-8 text-red-500" />
      </div>

      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        Recipe Generation Failed
      </h3>

      <p className="text-gray-500 dark:text-gray-400 text-sm text-center max-w-sm mb-2">
        {getHint()}
      </p>

      <div className="mt-2 mb-6 px-4 py-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl max-w-sm w-full">
        <p className="text-xs text-red-600 dark:text-red-400 font-mono break-words">
          {error}
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </button>
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl transition-colors shadow-sm shadow-emerald-500/30"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    </div>
  );
}
