'use client';

import { useGameStore } from '@/store/gameStore';

export default function GameStatus() {
  const { message, outcome } = useGameStore();

  // Determine styling based on outcome
  const getStatusColor = () => {
    if (!outcome) return 'text-casino-gold';
    if (outcome === 'win' || outcome === 'blackjack') return 'text-green-400';
    if (outcome === 'lose') return 'text-red-400';
    return 'text-yellow-400'; // push
  };

  const getStatusBackground = () => {
    if (!outcome) return 'bg-black/40 border-casino-gold-dark';
    if (outcome === 'win') return 'bg-green-900/40 border-green-600';
    if (outcome === 'blackjack') return 'bg-casino-gold/20 border-casino-gold';
    if (outcome === 'lose') return 'bg-red-900/40 border-red-600';
    return 'bg-yellow-900/40 border-yellow-600'; // push
  };

  return (
    <div
      className={`
        px-6 py-4 rounded-lg border-2 transition-all duration-300
        ${getStatusBackground()}
      `}
    >
      <p
        className={`
          text-center text-lg sm:text-xl md:text-2xl font-bold uppercase tracking-wide
          ${getStatusColor()}
        `}
      >
        {message}
      </p>
    </div>
  );
}
