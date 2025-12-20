'use client';

import { useGameStore } from '@/store/gameStore';
import { MIN_BET } from '@/lib/constants';

const BET_AMOUNTS = [5, 10, 25, 50, 100];

export default function BetControls() {
  const { chips, currentBet, placeBet, deal } = useGameStore();

  const canBet = (amount: number) => amount <= chips && amount >= MIN_BET;
  const canDeal = currentBet >= MIN_BET && currentBet <= chips;

  return (
    <div className="flex flex-col items-center gap-3 sm:gap-4 w-full max-w-md px-2 sm:px-0">
      {/* Current Bet Display */}
      {currentBet > 0 && (
        <div className="px-4 sm:px-6 py-2 sm:py-3 bg-casino-gold/20 rounded-lg border-2 border-casino-gold">
          <div className="text-center">
            <span className="text-xs sm:text-sm text-casino-gold-light uppercase block">Current Bet</span>
            <span className="text-2xl sm:text-3xl font-bold text-casino-gold">{currentBet}</span>
          </div>
        </div>
      )}

      {/* Bet Amount Buttons */}
      <div className="grid grid-cols-3 sm:flex sm:flex-wrap gap-2 sm:gap-3 justify-center w-full">
        {BET_AMOUNTS.map((amount) => (
          <button
            key={amount}
            onClick={() => placeBet(amount)}
            disabled={!canBet(amount)}
            className={`
              px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold text-base sm:text-lg transition-all touch-manipulation min-h-[44px]
              ${
                canBet(amount)
                  ? 'bg-casino-gold hover:bg-casino-gold-light active:brightness-90 text-black hover:scale-105 active:scale-95 shadow-lg'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
              }
              ${currentBet === amount ? 'ring-4 ring-casino-gold-light' : ''}
            `}
          >
            {amount}
          </button>
        ))}

        {/* All In Button */}
        <button
          onClick={() => placeBet(chips)}
          disabled={chips < MIN_BET}
          className={`
            px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold text-base sm:text-lg transition-all touch-manipulation min-h-[44px] col-span-3 sm:col-span-1
            ${
              chips >= MIN_BET
                ? 'bg-red-600 hover:bg-red-500 active:bg-red-700 text-white hover:scale-105 active:scale-95 shadow-lg'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
            }
            ${currentBet === chips ? 'ring-4 ring-red-400' : ''}
          `}
        >
          ALL IN
        </button>
      </div>

      {/* Deal Button */}
      <button
        onClick={deal}
        disabled={!canDeal}
        className={`
          w-full py-3 sm:py-4 rounded-lg font-bold text-lg sm:text-xl transition-all touch-manipulation min-h-[48px]
          ${
            canDeal
              ? 'bg-green-600 hover:bg-green-500 active:bg-green-700 text-white hover:scale-105 active:scale-95 shadow-xl'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed opacity-50'
          }
        `}
      >
        DEAL
      </button>
    </div>
  );
}
