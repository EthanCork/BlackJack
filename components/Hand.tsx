'use client';

import { type Card as CardType } from '@/types/game';
import Card from './Card';
import { calculateHandValue, getFaceUpCards } from '@/lib/blackjack';

interface HandProps {
  cards: CardType[];
  label: string;
  showValue?: boolean; // Whether to show hand value
  hideHoleCard?: boolean; // For dealer before reveal
  outcome?: 'win' | 'lose' | 'push' | 'blackjack' | null;
}

export default function Hand({
  cards,
  label,
  showValue = true,
  hideHoleCard = false,
  outcome = null,
}: HandProps) {
  // Calculate value based on visible cards only if hiding hole card
  const visibleCards = hideHoleCard ? getFaceUpCards(cards) : cards;
  const handValue = calculateHandValue(visibleCards);

  // Determine styling based on outcome
  const getOutcomeClass = () => {
    if (!outcome) return '';
    if (outcome === 'win') return 'animate-pulse-green';
    if (outcome === 'blackjack') return 'animate-shimmer';
    if (outcome === 'lose') return 'opacity-60';
    return '';
  };

  return (
    <div className="flex flex-col items-center gap-2 sm:gap-3">
      {/* Label and Value */}
      <div className="flex items-center gap-2 sm:gap-3">
        <span className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-casino-gold uppercase tracking-wider">
          {label}
        </span>
        {showValue && cards.length > 0 && (
          <div className="px-2 sm:px-3 py-0.5 sm:py-1 bg-black/40 rounded-full border border-casino-gold-dark">
            <span className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-white">
              {handValue.value}
              {handValue.soft && (
                <span className="text-[10px] sm:text-xs ml-1 text-casino-gold-light">soft</span>
              )}
            </span>
          </div>
        )}
      </div>

      {/* Cards */}
      <div className={`flex gap-1 sm:gap-1.5 md:gap-2 ${getOutcomeClass()} flex-wrap justify-center max-w-full`}>
        {cards.map((card, index) => (
          <Card key={`${card.suit}-${card.rank}-${index}`} card={card} index={index} />
        ))}
      </div>
    </div>
  );
}
