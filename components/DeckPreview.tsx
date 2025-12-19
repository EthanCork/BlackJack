'use client';

import { useState } from 'react';
import type { StarterDeckId, StarterDeck } from '@/types/starterDecks';
import { getStarterDeck } from '@/data/starterDeckPool';
import { getDeckStatistics } from '@/lib/starterDeckGenerator';
import { useGameStore } from '@/store/gameStore';
import { DECK_UNLOCK_REQUIREMENTS } from '@/lib/deckUnlocks';
import DeckViewer from './DeckViewer';

interface DeckPreviewProps {
  deckId: StarterDeckId;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeckPreview({ deckId, onClose, onConfirm }: DeckPreviewProps) {
  const [showFullDeck, setShowFullDeck] = useState(false);
  const { deckUnlocks, dust, unlockDeckWithDust } = useGameStore();
  const deck = getStarterDeck(deckId);
  const isLocked = !deckUnlocks[deckId]?.unlocked;
  const unlockReq = DECK_UNLOCK_REQUIREMENTS[deckId];

  const handleUnlock = () => {
    if (unlockDeckWithDust(deckId)) {
      // Successfully unlocked
    }
  };

  if (showFullDeck) {
    return (
      <DeckViewer
        deck={deck}
        onBack={() => setShowFullDeck(false)}
      />
    );
  }

  // Get deck statistics
  const stats = getDeckStatistics(deckId);

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-8">
      <div
        className="max-w-4xl w-full rounded-xl shadow-2xl p-8 relative"
        style={{
          background: `linear-gradient(135deg, ${deck.colorTheme.primary}20 0%, ${deck.colorTheme.secondary}20 100%)`,
          border: `2px solid ${deck.colorTheme.primary}`,
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-red-600 hover:bg-red-500 font-bold"
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-2">{deck.icon}</div>
          <h2 className="text-4xl font-bold mb-2">{deck.name}</h2>
          <p className="text-xl italic text-gray-300">"{deck.tagline}"</p>
        </div>

        {/* Description */}
        <div className="mb-6 text-center">
          <p className="text-gray-300">{deck.description}</p>
        </div>

        {/* Starting Resources */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-black/40 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">{deck.startingChips}</div>
            <div className="text-sm text-gray-400">Starting Chips</div>
          </div>
          <div className="bg-black/40 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{deck.startingEdge}</div>
            <div className="text-sm text-gray-400">Starting Edge</div>
          </div>
          <div className="bg-black/40 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{deck.maxEdge}</div>
            <div className="text-sm text-gray-400">Max Edge</div>
          </div>
        </div>

        {/* Deck Statistics */}
        <div className="bg-black/40 rounded-lg p-4 mb-6">
          <h3 className="font-bold mb-3 text-center">Deck Statistics</h3>
          <div className="grid grid-cols-4 gap-4 text-center text-sm">
            <div>
              <div className="text-lg font-bold">{deck.deckSize}</div>
              <div className="text-gray-400">Total Cards</div>
            </div>
            <div>
              <div className="text-lg font-bold">{stats.avgValue}</div>
              <div className="text-gray-400">Avg Value</div>
            </div>
            <div>
              <div className="text-lg font-bold">{stats.tens}</div>
              <div className="text-gray-400">10-Values</div>
            </div>
            <div>
              <div className="text-lg font-bold">{stats.aces}</div>
              <div className="text-gray-400">Aces</div>
            </div>
          </div>
        </div>

        {/* Deck Trait */}
        <div
          className="rounded-lg p-4 mb-6"
          style={{
            background: `linear-gradient(90deg, ${deck.colorTheme.primary}40 0%, ${deck.colorTheme.secondary}40 100%)`,
            border: `1px solid ${deck.colorTheme.primary}`,
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{deck.signaturePassive.icon}</span>
            <h3 className="font-bold text-lg">DECK TRAIT: {deck.signaturePassive.name}</h3>
          </div>
          <p className="text-gray-300 text-sm">{deck.signaturePassive.description}</p>
        </div>

        {/* Playstyle */}
        <div className="bg-black/40 rounded-lg p-4 mb-6">
          <h3 className="font-bold mb-2">Playstyle</h3>
          <p className="text-sm text-gray-300">{deck.playstyleDescription}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => setShowFullDeck(true)}
            className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold transition-colors"
          >
            View Full Deck
          </button>
          {isLocked ? (
            <button
              onClick={handleUnlock}
              disabled={dust < unlockReq.dustCost}
              className={`flex-1 px-6 py-3 rounded-lg font-bold transition-all transform ${
                dust >= unlockReq.dustCost
                  ? 'bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 hover:scale-105'
                  : 'bg-gray-600 cursor-not-allowed opacity-50'
              }`}
            >
              {dust >= unlockReq.dustCost
                ? `Unlock with ${unlockReq.dustCost} Dust`
                : `Need ${unlockReq.dustCost} Dust (have ${dust})`
              }
            </button>
          ) : (
            <button
              onClick={onConfirm}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 rounded-lg font-bold transition-all transform hover:scale-105"
            >
              Select This Deck
            </button>
          )}
        </div>

        {/* Unlock Info */}
        {isLocked && (
          <div className="mt-4 p-4 bg-black/30 rounded-lg border border-yellow-600/30">
            <h4 className="font-bold text-yellow-400 mb-2">🔒 How to Unlock:</h4>
            <p className="text-sm text-gray-300 mb-2">
              • Achievement: {unlockReq.achievementDescription}
            </p>
            <p className="text-sm text-gray-300">
              • OR: Spend {unlockReq.dustCost} Dust to unlock now
            </p>
          </div>
        )}

        {/* Difficulty Indicator */}
        <div className="text-center mt-4 text-sm text-gray-400">
          Difficulty: <span className={`font-bold ${
            deck.difficulty === 'beginner' && 'text-green-400'
          }${
            deck.difficulty === 'intermediate' && 'text-yellow-400'
          }${
            deck.difficulty === 'advanced' && 'text-red-400'
          }`}>
            {deck.difficulty.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
}
