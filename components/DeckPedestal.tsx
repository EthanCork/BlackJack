'use client';

import type { StarterDeck } from '@/types/starterDecks';

interface DeckPedestalProps {
  deck: StarterDeck;
  isSelected: boolean;
  isLocked?: boolean;
  onClick: () => void;
}

export default function DeckPedestal({ deck, isSelected, isLocked = false, onClick }: DeckPedestalProps) {
  return (
    <button
      onClick={onClick}
      className={`
        relative w-40 h-56 rounded-lg p-4
        transition-all duration-300 transform
        ${isSelected
          ? 'scale-110 ring-4 ring-white shadow-2xl'
          : 'hover:scale-105 hover:shadow-xl'
        }
        ${isLocked ? 'opacity-60' : ''}
      `}
      style={{
        background: `linear-gradient(135deg, ${deck.colorTheme.primary} 0%, ${deck.colorTheme.secondary} 100%)`,
      }}
    >
      {/* Lock Overlay */}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg">
          <div className="text-6xl">🔒</div>
        </div>
      )}
      {/* Icon */}
      <div className="text-6xl mb-2 text-center">
        {deck.icon}
      </div>

      {/* Name */}
      <h3 className="text-sm font-bold text-center mb-2 text-white drop-shadow-md">
        {deck.name}
      </h3>

      {/* Quick Stats */}
      <div className="text-xs text-white/90 space-y-1">
        <div className="flex justify-between">
          <span>Cards:</span>
          <span className="font-bold">{deck.deckSize}</span>
        </div>
        <div className="flex justify-between">
          <span>Chips:</span>
          <span className="font-bold">{deck.startingChips}</span>
        </div>
        <div className="flex justify-between">
          <span>Edge:</span>
          <span className="font-bold">{deck.startingEdge}</span>
        </div>
      </div>

      {/* Difficulty Badge */}
      <div className="absolute top-2 right-2">
        <div className={`
          px-2 py-1 rounded text-xs font-bold
          ${deck.difficulty === 'beginner' && 'bg-green-500/80'}
          ${deck.difficulty === 'intermediate' && 'bg-yellow-500/80'}
          ${deck.difficulty === 'advanced' && 'bg-red-500/80'}
        `}>
          {deck.difficulty === 'beginner' && '★'}
          {deck.difficulty === 'intermediate' && '★★'}
          {deck.difficulty === 'advanced' && '★★★'}
        </div>
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
          <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
        </div>
      )}
    </button>
  );
}
