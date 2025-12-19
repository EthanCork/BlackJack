'use client';

import { useGameStore } from '@/store/gameStore';
import Card from './Card';
import { calculateHandValue } from '@/lib/blackjack';

export default function SplitHands() {
  const { splitState } = useGameStore();

  if (!splitState || !splitState.isActive) return null;

  const { hands, bets, activeHandIndex, outcomes } = splitState;

  return (
    <div className="w-full max-w-5xl">
      <div className="text-center mb-4">
        <span className="text-casino-gold-light text-sm uppercase tracking-wide">Split Hands</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {hands.map((hand, index) => {
          const isActive = activeHandIndex === index;
          const handValue = calculateHandValue(hand);
          const outcome = outcomes[index];

          return (
            <div
              key={index}
              className={`
                relative p-6 rounded-lg border-2 transition-all duration-300
                ${isActive
                  ? 'border-casino-gold bg-casino-gold/10 shadow-lg shadow-casino-gold/50'
                  : 'border-gray-700 bg-black/40'
                }
                ${outcome === 'win' ? 'animate-pulse-green' : ''}
                ${outcome === 'lose' ? 'opacity-60' : ''}
              `}
            >
              {/* Hand Label */}
              <div className="absolute top-2 left-2 px-3 py-1 bg-black/60 rounded-full border border-casino-gold-dark">
                <span className={`text-sm font-bold ${isActive ? 'text-casino-gold' : 'text-gray-400'}`}>
                  HAND {index + 1}
                </span>
                {isActive && (
                  <span className="ml-2 text-xs text-casino-gold-light">(Active)</span>
                )}
              </div>

              {/* Hand Value and Bet */}
              <div className="flex justify-between items-start mb-4 mt-8">
                <div className="px-4 py-2 bg-black/60 rounded-lg border border-casino-gold-dark">
                  <span className="text-xs text-gray-400 uppercase block mb-1">Value</span>
                  <span className="text-2xl font-bold text-white">
                    {handValue.value}
                    {handValue.soft && (
                      <span className="text-xs ml-1 text-casino-gold-light">soft</span>
                    )}
                  </span>
                </div>

                <div className="px-4 py-2 bg-black/60 rounded-lg border border-casino-gold-dark">
                  <span className="text-xs text-gray-400 uppercase block mb-1">Bet</span>
                  <span className="text-2xl font-bold text-casino-gold">{bets[index]}</span>
                </div>
              </div>

              {/* Cards */}
              <div className="flex justify-center gap-2 mb-4">
                {hand.map((card, cardIndex) => (
                  <Card key={`${index}-${cardIndex}`} card={card} index={cardIndex} />
                ))}
              </div>

              {/* Outcome Badge */}
              {outcome && (
                <div className="text-center">
                  <span
                    className={`
                      inline-block px-4 py-2 rounded-full font-bold uppercase text-sm
                      ${outcome === 'win' ? 'bg-green-900/60 text-green-400 border border-green-600' : ''}
                      ${outcome === 'lose' ? 'bg-red-900/60 text-red-400 border border-red-600' : ''}
                      ${outcome === 'push' ? 'bg-yellow-900/60 text-yellow-400 border border-yellow-600' : ''}
                    `}
                  >
                    {outcome}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
