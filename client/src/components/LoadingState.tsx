import { UtensilsCrossed } from 'lucide-react';

const MESSAGES = [
  'Analyzing your ingredients…',
  'Crafting the perfect recipe…',
  'Selecting the best techniques…',
  'Calculating nutrition info…',
  'Adding finishing touches…',
];

export default function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
      <div className="relative mb-8">
        <div className="w-20 h-20 bg-blossom-gradient rounded-2xl flex items-center justify-center shadow-blossom-lg animate-bounce-gentle">
          <UtensilsCrossed className="w-10 h-10 text-rose-600" />
        </div>
        <div className="absolute inset-0 rounded-2xl bg-blossom-300 animate-pulse-ring opacity-60" />
      </div>

      <h3 className="text-xl font-bold text-gray-900 dark:text-blossom-100 mb-2">Crafting Your Recipe</h3>
      <p className="text-rose-300 text-sm mb-8 text-center max-w-xs">
        Our chef is creating a personalized recipe just for you
      </p>

      <div className="flex gap-2 mb-6">
        {[0, 1, 2].map(i => (
          <div key={i} className="w-2 h-2 bg-blossom-300 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>

      <div className="h-5 overflow-hidden">
        <div className="flex flex-col gap-5 animate-[scroll_7.5s_linear_infinite]">
          {[...MESSAGES, ...MESSAGES].map((msg, i) => (
            <p key={i} className="text-xs text-rose-300 text-center h-5 leading-5">{msg}</p>
          ))}
        </div>
      </div>
      <style>{`@keyframes scroll { 0% { transform: translateY(0); } 100% { transform: translateY(-50%); } }`}</style>
    </div>
  );
}
