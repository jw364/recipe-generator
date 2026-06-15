import { UtensilsCrossed } from 'lucide-react';

const LOADING_MESSAGES = [
  'Analyzing your ingredients…',
  'Crafting the perfect recipe…',
  'Selecting the best techniques…',
  'Calculating nutrition info…',
  'Adding finishing touches…',
];

export default function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
      {/* Animated icon */}
      <div className="relative mb-8">
        <div className="w-20 h-20 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-500/30 animate-bounce-gentle">
          <UtensilsCrossed className="w-10 h-10 text-white" />
        </div>
        <div className="absolute inset-0 rounded-2xl bg-emerald-400 animate-pulse-ring opacity-60" />
      </div>

      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        Generating Your Recipe
      </h3>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 text-center max-w-xs">
        Our AI chef is creating a personalized recipe just for you
      </p>

      {/* Progress dots */}
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>

      {/* Cycling messages */}
      <div className="mt-6 h-5 overflow-hidden">
        <div className="flex flex-col gap-5 animate-[scroll_7.5s_linear_infinite]">
          {[...LOADING_MESSAGES, ...LOADING_MESSAGES].map((msg, i) => (
            <p key={i} className="text-xs text-gray-400 dark:text-gray-500 text-center h-5 leading-5">
              {msg}
            </p>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
      `}</style>
    </div>
  );
}
