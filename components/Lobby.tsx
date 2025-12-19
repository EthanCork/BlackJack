'use client';

import { useState, useEffect } from 'react';
import type { StarterDeckId } from '@/types/starterDecks';
import { getAllStarterDecks } from '@/data/starterDeckPool';
import { useGameStore } from '@/store/gameStore';
import DeckPedestal from './DeckPedestal';
import DeckPreview from './DeckPreview';

interface LobbyProps {
  onSelectDeck: (deckId: StarterDeckId) => void;
  lastPlayedDeck?: StarterDeckId;
}

export default function Lobby({ onSelectDeck, lastPlayedDeck }: LobbyProps) {
  const [selectedDeck, setSelectedDeck] = useState<StarterDeckId | null>(lastPlayedDeck || null);
  const [showFullPreview, setShowFullPreview] = useState(false);
  const { deckUnlocks, dust, loadMetaProgress, unlockDeckWithDust } = useGameStore();

  // Load meta progress on mount
  useEffect(() => {
    loadMetaProgress();
  }, [loadMetaProgress]);

  const allDecks = getAllStarterDecks();

  const handleDeckClick = (deckId: StarterDeckId) => {
    // Check if deck is unlocked
    if (!deckUnlocks[deckId]?.unlocked) {
      // Show unlock info instead
      setSelectedDeck(deckId);
      setShowFullPreview(true);
      return;
    }

    setSelectedDeck(deckId);
    setShowFullPreview(true);
  };

  const handleConfirmSelection = () => {
    if (selectedDeck) {
      onSelectDeck(selectedDeck);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white flex flex-col items-center justify-center p-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
          THE LOBBY
        </h1>
        <p className="text-2xl text-gray-400 italic">Build Your Foundation</p>
        {lastPlayedDeck && (
          <p className="text-sm text-gray-500 mt-2">
            Last played: {allDecks.find(d => d.id === lastPlayedDeck)?.name}
          </p>
        )}
      </div>

      {/* Dust Display */}
      <div className="mb-6 text-center">
        <div className="inline-block px-6 py-3 bg-gradient-to-r from-yellow-600 to-amber-600 rounded-full border-2 border-yellow-400">
          <span className="text-2xl font-bold text-white">✨ {dust} Dust</span>
        </div>
      </div>

      {/* Deck Pedestals */}
      <div className="grid grid-cols-5 gap-6 mb-12 max-w-7xl">
        {allDecks.map((deck) => (
          <DeckPedestal
            key={deck.id}
            deck={deck}
            isSelected={selectedDeck === deck.id}
            isLocked={!deckUnlocks[deck.id]?.unlocked}
            onClick={() => handleDeckClick(deck.id)}
          />
        ))}
      </div>

      {/* Deck Preview Panel */}
      {selectedDeck && showFullPreview && (
        <DeckPreview
          deckId={selectedDeck}
          onClose={() => setShowFullPreview(false)}
          onConfirm={handleConfirmSelection}
        />
      )}

      {/* Quick Select Button */}
      {selectedDeck && !showFullPreview && (
        <div className="text-center">
          <button
            onClick={handleConfirmSelection}
            className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 rounded-lg font-bold text-xl shadow-lg transform hover:scale-105 transition-all"
          >
            Start Run with {allDecks.find(d => d.id === selectedDeck)?.name}
          </button>
          <p className="text-xs text-gray-500 mt-2">
            or click deck again to view details
          </p>
        </div>
      )}

      {/* Instructions */}
      {!selectedDeck && (
        <div className="text-center text-gray-400 text-sm max-w-2xl">
          <p>Choose your starting deck. Each has different cards and a unique trait.</p>
          <p className="mt-2 text-gray-500">
            Recommended for new players: <span className="text-blue-400 font-bold">The Foundation</span>
          </p>
        </div>
      )}
    </div>
  );
}
