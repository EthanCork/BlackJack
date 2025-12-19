'use client';

import type { Card } from '@/types/game';
import type { SpecialCard } from '@/types/specialCards';

interface DeckViewProps {
  deck: (Card | SpecialCard)[];
  onRemove?: (card: Card | SpecialCard) => void;
  canRemove?: boolean;
  removeCost?: number;
}

export default function DeckView({ deck, onRemove, canRemove = false, removeCost = 10 }: DeckViewProps) {
  // Group cards by rank
  const cardCounts: Record<string, { card: Card | SpecialCard; count: number }> = {};

  deck.forEach(card => {
    const key = isSpecialCard(card)
      ? `special_${card.specialType}`
      : `${card.rank}_${card.suit}`;

    if (!cardCounts[key]) {
      cardCounts[key] = { card, count: 0 };
    }
    cardCounts[key].count++;
  });

  const sortedCards = Object.values(cardCounts).sort((a, b) => {
    // Special cards first
    const aSpecial = isSpecialCard(a.card);
    const bSpecial = isSpecialCard(b.card);
    if (aSpecial && !bSpecial) return -1;
    if (!aSpecial && bSpecial) return 1;

    // Then by rank value
    return b.card.value - a.card.value;
  });

  return (
    <div className="w-full">
      <div className="text-sm text-gray-400 mb-2">
        Total Cards: {deck.length}
      </div>
      <div className="grid grid-cols-4 gap-2 max-h-[400px] overflow-y-auto p-2 bg-gray-900 rounded">
        {sortedCards.map(({ card, count }) => (
          <DeckCardDisplay
            key={isSpecialCard(card) ? `special_${card.specialType}` : `${card.rank}_${card.suit}`}
            card={card}
            count={count}
            onRemove={canRemove && onRemove ? () => onRemove(card) : undefined}
            removeCost={removeCost}
          />
        ))}
      </div>
    </div>
  );
}

function DeckCardDisplay({
  card,
  count,
  onRemove,
  removeCost
}: {
  card: Card | SpecialCard;
  count: number;
  onRemove?: () => void;
  removeCost: number;
}) {
  const special = isSpecialCard(card);

  return (
    <div className="relative">
      <div
        className={`
          p-2 rounded border-2 text-center
          ${special ? 'bg-yellow-900 border-yellow-500' : 'bg-gray-800 border-gray-600'}
        `}
      >
        {/* Card Display */}
        <div className="text-lg font-bold">
          {card.rank}
          {!special && getSuitSymbol(card.suit)}
        </div>
        <div className="text-xs text-gray-400">
          x{count}
        </div>

        {/* Special Card Label */}
        {special && (
          <div className="text-xs text-yellow-400 mt-1">
            {formatSpecialType(card.specialType)}
          </div>
        )}
      </div>

      {/* Remove Button */}
      {onRemove && (
        <button
          onClick={onRemove}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 hover:bg-red-500 rounded-full text-xs font-bold"
          title={`Remove for ${removeCost} chips`}
        >
          ✕
        </button>
      )}
    </div>
  );
}

function isSpecialCard(card: Card | SpecialCard): card is SpecialCard {
  return (card as SpecialCard).specialType !== undefined;
}

function getSuitSymbol(suit: string): string {
  switch (suit) {
    case 'hearts': return '♥';
    case 'diamonds': return '♦';
    case 'clubs': return '♣';
    case 'spades': return '♠';
    default: return '';
  }
}

function formatSpecialType(type: string): string {
  return type
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
