'use client';

import { useGameStore } from '@/store/gameStore';
import type { Card } from '@/types/game';
import { getSpecialCardName } from '@/lib/specialCards';

interface CardRewardOption {
  card: Card;
  description: string;
}

export default function CardRewardScreen() {
  const { cardRewardOptions, selectCardReward, skipCardReward } = useGameStore();

  if (!cardRewardOptions || cardRewardOptions.length === 0) {
    return null;
  }

  const getCardColor = (card: Card): string => {
    if (card.special === 'golden') return 'from-yellow-500 to-amber-600';
    if (card.special === 'wild') return 'from-purple-500 to-indigo-600';
    if (['hearts', 'diamonds'].includes(card.suit)) return 'from-red-500 to-red-700';
    return 'from-gray-700 to-gray-900';
  };

  const getSuitSymbol = (suit: string): string => {
    const symbols: Record<string, string> = {
      hearts: '♥',
      diamonds: '♦',
      clubs: '♣',
      spades: '♠',
    };
    return symbols[suit] || '';
  };

  const getCardDescription = (card: Card): string => {
    const value = card.value;

    if (card.special === 'wild') {
      return 'Choose its rank when drawn';
    }
    if (card.special === 'golden') {
      return '+2 chips when in opening hand';
    }
    if (card.rank === 'A') {
      return 'Worth 1 or 11, essential for Blackjacks';
    }
    if (value === 10) {
      return 'High-value card, great for strong hands';
    }
    if (value <= 6) {
      return 'Low-value card, safe for hitting';
    }
    return 'Mid-value card, balanced utility';
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-casino-gold mb-2">
            Choose a Card Reward
          </h2>
          <p className="text-xl text-gray-300">
            Add one card to your deck to make it stronger
          </p>
        </div>

        {/* Card Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {cardRewardOptions.map((option, index) => {
            const card = option.card;
            const displayName = card.special ? getSpecialCardName(card) : card.rank;

            return (
              <button
                key={index}
                onClick={() => selectCardReward(index)}
                className="group relative"
              >
                <div
                  className={`
                    bg-gradient-to-br ${getCardColor(card)}
                    rounded-xl p-8 border-4 border-white/20
                    transform transition-all duration-300
                    group-hover:scale-105 group-hover:border-casino-gold
                    shadow-2xl group-hover:shadow-casino-gold/50
                  `}
                >
                  {/* Card Display */}
                  <div className="text-center mb-4">
                    <div className="text-6xl font-bold text-white mb-2">
                      {displayName}
                    </div>
                    {!card.special && (
                      <div className="text-5xl opacity-75">
                        {getSuitSymbol(card.suit)}
                      </div>
                    )}
                    {card.special && (
                      <div className="text-3xl">
                        {card.special === 'wild' ? '🃏' : '✨'}
                      </div>
                    )}
                  </div>

                  {/* Card Stats */}
                  <div className="bg-black/30 rounded-lg p-4 mb-4">
                    <div className="text-white text-lg font-bold mb-1">
                      Value: {card.value}
                    </div>
                    <div className="text-gray-200 text-sm">
                      {getCardDescription(card)}
                    </div>
                  </div>

                  {/* Custom Description if provided */}
                  {option.description && (
                    <div className="text-white/90 text-sm italic">
                      {option.description}
                    </div>
                  )}

                  {/* Hover Indicator */}
                  <div className="absolute inset-0 rounded-xl border-4 border-casino-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Skip Button */}
        <div className="text-center">
          <button
            onClick={skipCardReward}
            className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-all duration-200 border-2 border-gray-600 hover:border-gray-500"
          >
            Skip (no card added)
          </button>
          <p className="text-gray-400 text-sm mt-2">
            You can skip if you want to keep your deck lean
          </p>
        </div>
      </div>
    </div>
  );
}
