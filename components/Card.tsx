'use client';

import { type Card as CardType } from '@/types/game';

interface CardProps {
  card: CardType;
  index?: number; // For staggered animation
}

const SUIT_SYMBOLS = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠',
};

const SUIT_COLORS = {
  hearts: 'text-red-600',
  diamonds: 'text-red-600',
  clubs: 'text-black',
  spades: 'text-black',
};

export default function Card({ card, index = 0 }: CardProps) {
  const suitSymbol = SUIT_SYMBOLS[card.suit];
  const suitColor = SUIT_COLORS[card.suit];

  return (
    <div
      className="relative w-16 h-24 sm:w-20 sm:h-28 md:w-24 md:h-36"
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      <div
        className={`
          absolute inset-0 transition-transform duration-400 preserve-3d
          ${card.faceUp ? '[transform:rotateY(180deg)]' : ''}
        `}
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Card Back */}
        <div
          className="absolute inset-0 backface-hidden rounded-lg border-2 border-casino-gold bg-gradient-to-br from-gray-800 to-black shadow-lg"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="w-full h-full flex items-center justify-center p-2">
            <div className="w-full h-full border-2 border-casino-gold-dark rounded opacity-40">
              <div className="w-full h-full bg-gradient-to-br from-casino-gold-dark to-transparent opacity-20 rounded" />
            </div>
          </div>
        </div>

        {/* Card Front */}
        <div
          className="absolute inset-0 backface-hidden [transform:rotateY(180deg)] rounded-lg border-2 border-gray-300 bg-white shadow-lg"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="w-full h-full p-2 flex flex-col justify-between">
            {/* Top rank and suit */}
            <div className="flex flex-col items-center">
              <span className={`text-lg sm:text-xl md:text-2xl font-bold ${suitColor}`}>
                {card.rank}
              </span>
              <span className={`text-lg sm:text-xl md:text-2xl ${suitColor}`}>
                {suitSymbol}
              </span>
            </div>

            {/* Center suit symbol */}
            <div className="flex-1 flex items-center justify-center">
              <span className={`text-3xl sm:text-4xl md:text-5xl ${suitColor}`}>
                {suitSymbol}
              </span>
            </div>

            {/* Bottom rank and suit (rotated) */}
            <div className="flex flex-col items-center rotate-180">
              <span className={`text-lg sm:text-xl md:text-2xl font-bold ${suitColor}`}>
                {card.rank}
              </span>
              <span className={`text-lg sm:text-xl md:text-2xl ${suitColor}`}>
                {suitSymbol}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
