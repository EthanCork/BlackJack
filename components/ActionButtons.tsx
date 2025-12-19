'use client';

import { useGameStore } from '@/store/gameStore';

export default function ActionButtons() {
  const { phase, hit, stand, resetHand, resetGame, doubleDown, split, canDoubleDown, canSplit, currentBet } = useGameStore();

  if (phase === 'playerTurn') {
    const showDouble = canDoubleDown();
    const showSplit = canSplit();

    return (
      <div className="flex flex-col items-center gap-3 w-full max-w-2xl">
        {/* Primary actions - always visible */}
        <div className="flex gap-3 w-full">
          <button
            onClick={hit}
            className="flex-1 py-4 rounded-lg font-bold text-xl bg-blue-600 hover:bg-blue-500 text-white transition-all hover:scale-105 active:scale-95 shadow-xl"
          >
            HIT
          </button>
          <button
            onClick={stand}
            className="flex-1 py-4 rounded-lg font-bold text-xl bg-orange-600 hover:bg-orange-500 text-white transition-all hover:scale-105 active:scale-95 shadow-xl"
          >
            STAND
          </button>
        </div>

        {/* Secondary actions - conditional */}
        {(showDouble || showSplit) && (
          <div className="flex gap-3 w-full">
            {showDouble && (
              <button
                onClick={doubleDown}
                className="flex-1 py-4 rounded-lg font-bold text-xl bg-gradient-to-r from-casino-gold to-casino-gold-light hover:from-casino-gold-light hover:to-casino-gold text-black transition-all hover:scale-105 active:scale-95 shadow-xl relative overflow-hidden"
              >
                <span className="relative z-10">DOUBLE</span>
                <span className="relative z-10 text-sm ml-2">(+{currentBet})</span>
                <div className="absolute inset-0 bg-gradient-to-r from-casino-gold-light to-casino-gold opacity-0 hover:opacity-100 transition-opacity" />
              </button>
            )}
            {showSplit && (
              <button
                onClick={split}
                className="flex-1 py-4 rounded-lg font-bold text-xl bg-purple-600 hover:bg-purple-500 text-white transition-all hover:scale-105 active:scale-95 shadow-xl"
              >
                SPLIT
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  if (phase === 'resolution') {
    return (
      <button
        onClick={resetHand}
        className="w-full max-w-md py-4 rounded-lg font-bold text-xl bg-green-600 hover:bg-green-500 text-white transition-all hover:scale-105 active:scale-95 shadow-xl"
      >
        DEAL AGAIN
      </button>
    );
  }

  if (phase === 'gameOver') {
    return (
      <button
        onClick={resetGame}
        className="w-full max-w-md py-4 rounded-lg font-bold text-xl bg-red-600 hover:bg-red-500 text-white transition-all hover:scale-105 active:scale-95 shadow-xl"
      >
        NEW GAME
      </button>
    );
  }

  return null;
}
