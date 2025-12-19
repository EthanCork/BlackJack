'use client';

import type { Rank } from '@/types/game';

interface WildCardSelectorProps {
  onSelectRank: (rank: Rank) => void;
  onCancel: () => void;
}

export default function WildCardSelector({ onSelectRank, onCancel }: WildCardSelectorProps) {
  const ranks: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  const getRankValue = (rank: Rank): number => {
    if (rank === 'A') return 11;
    if (['J', 'Q', 'K'].includes(rank)) return 10;
    return parseInt(rank);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 rounded-xl shadow-2xl p-8 max-w-2xl w-full border-2 border-purple-400">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🃏</div>
          <h2 className="text-3xl font-bold text-white mb-2">Wild Card</h2>
          <p className="text-purple-200">
            Choose what rank this Wild card becomes
          </p>
        </div>

        {/* Rank Selection Grid */}
        <div className="grid grid-cols-6 sm:grid-cols-7 gap-2 mb-6">
          {ranks.map((rank) => {
            const value = getRankValue(rank);
            const isHighValue = value >= 10;

            return (
              <button
                key={rank}
                onClick={() => onSelectRank(rank)}
                className={`
                  py-4 px-2 rounded-lg font-bold text-xl
                  transition-all duration-200 transform hover:scale-105
                  ${
                    isHighValue
                      ? 'bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black'
                      : 'bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white'
                  }
                  border-2 border-white/20 hover:border-white/40
                  shadow-lg hover:shadow-xl
                `}
              >
                <div>{rank}</div>
                <div className="text-xs opacity-75">({value})</div>
              </button>
            );
          })}
        </div>

        {/* Cancel Button */}
        <button
          onClick={onCancel}
          className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-all duration-200"
        >
          Cancel
        </button>

        {/* Tip */}
        <div className="mt-4 text-center text-sm text-purple-300">
          💡 Tip: High cards (10, J, Q, K) are highlighted in gold
        </div>
      </div>
    </div>
  );
}
