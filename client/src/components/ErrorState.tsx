import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
  onBack: () => void;
}

export default function ErrorState({ error, onRetry, onBack }: ErrorStateProps) {
  const isRateLimit = error.toLowerCase().includes('rate limit') || error.includes('429');
  const isAuth = error.toLowerCase().includes('api key') || error.includes('401') || error.includes('403');
  const isNetwork = error.toLowerCase().includes('network') || error.includes('ECONNREFUSED');

  const hint = isRateLimit
    ? 'You have exceeded the API rate limit. Please wait a moment and try again.'
    : isAuth
    ? 'Your API key appears to be invalid or missing. Check the server configuration.'
    : isNetwork
    ? 'Cannot reach the server. Make sure the backend is running on port 3001.'
    : 'Something went wrong while generating your recipe. Please try again.';

  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-5">
        <AlertCircle className="w-8 h-8 text-red-400" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-blossom-100 mb-2">Recipe Generation Failed</h3>
      <p className="text-rose-300 text-sm text-center max-w-sm mb-3">{hint}</p>
      <div className="px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl max-w-sm w-full mb-6">
        <p className="text-xs text-red-500 font-mono break-words">{error}</p>
      </div>
      <div className="flex gap-3">
        <button onClick={onBack} className="btn-secondary"><ArrowLeft className="w-4 h-4" /> Go Back</button>
        <button onClick={onRetry} className="btn-primary"><RefreshCw className="w-4 h-4" /> Try Again</button>
      </div>
    </div>
  );
}
