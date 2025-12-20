'use client';

import { useGameStore } from '@/store/gameStore';

export default function ActionButtons() {
  const { phase, hit, stand, resetHand, resetGame, doubleDown, split, canDoubleDown, canSplit, currentBet } = useGameStore();

  if (phase === 'playerTurn') {
    const showDouble = canDoubleDown();
    const showSplit = canSplit();

    return (
      <div className="flex flex-col items-center gap-2 sm:gap-3 w-full max-w-2xl px-2 sm:px-0">
        {/* Primary actions - always visible */}
        <div className="flex gap-2 sm:gap-3 w-full">
          <button
            onClick={hit}
            className="flex-1 py-3 sm:py-4 rounded-lg font-bold text-lg sm:text-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white transition-all hover:scale-105 active:scale-95 shadow-xl touch-manipulation min-h-[48px]"
          >
            HIT
          </button>
          <button
            onClick={stand}
            className="flex-1 py-3 sm:py-4 rounded-lg font-bold text-lg sm:text-xl bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white transition-all hover:scale-105 active:scale-95 shadow-xl touch-manipulation min-h-[48px]"
          >
            STAND
          </button>
        </div>

        {/* Secondary actions - conditional */}
        {(showDouble || showSplit) && (
          <div className="flex gap-2 sm:gap-3 w-full">
            {showDouble && (
              <button
                onClick={doubleDown}
                className="flex-1 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-xl bg-gradient-to-r from-casino-gold to-casino-gold-light hover:from-casino-gold-light hover:to-casino-gold active:brightness-90 text-black transition-all hover:scale-105 active:scale-95 shadow-xl relative overflow-hidden touch-manipulation min-h-[48px]"
              >
                <span className="relative z-10">DOUBLE</span>
                <span className="relative z-10 text-xs sm:text-sm ml-1 sm:ml-2">(+{currentBet})</span>
                <div className="absolute inset-0 bg-gradient-to-r from-casino-gold-light to-casino-gold opacity-0 hover:opacity-100 transition-opacity" />
              </button>
            )}
            {showSplit && (
              <button
                onClick={split}
                className="flex-1 py-3 sm:py-4 rounded-lg font-bold text-lg sm:text-xl bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white transition-all hover:scale-105 active:scale-95 shadow-xl touch-manipulation min-h-[48px]"
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
        className="w-full max-w-md py-3 sm:py-4 rounded-lg font-bold text-lg sm:text-xl bg-green-600 hover:bg-green-500 active:bg-green-700 text-white transition-all hover:scale-105 active:scale-95 shadow-xl touch-manipulation min-h-[48px] mx-2 sm:mx-0"
      >
        DEAL AGAIN
      </button>
    );
  }

  if (phase === 'gameOver') {
    return (
      <button
        onClick={resetGame}
        className="w-full max-w-md py-3 sm:py-4 rounded-lg font-bold text-lg sm:text-xl bg-red-600 hover:bg-red-500 active:bg-red-700 text-white transition-all hover:scale-105 active:scale-95 shadow-xl touch-manipulation min-h-[48px] mx-2 sm:mx-0"
      >
        NEW GAME
      </button>
    );
  }

  return null;
}
