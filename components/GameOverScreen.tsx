'use client';

import { useGameStore } from '@/store/gameStore';
import { formatStats } from '@/lib/stats';
import { getGameOverEpitaph } from '@/lib/stages';

export default function GameOverScreen() {
  const { runStats, currentStage, setScreen } = useGameStore();

  const stats = formatStats(runStats);
  const epitaph = getGameOverEpitaph(currentStage);

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-red-950/50 via-black to-black backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-700">
      {/* Falling cards animation background */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute top-0 left-1/4 text-4xl animate-bounce" style={{ animationDuration: '3s' }}>♠</div>
        <div className="absolute top-20 right-1/3 text-4xl animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>♥</div>
        <div className="absolute top-40 left-1/2 text-4xl animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>♣</div>
      </div>

      <div className="max-w-2xl w-full bg-gradient-to-b from-gray-900 to-black border-2 border-red-900 rounded-2xl p-8 shadow-2xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-red-500 mb-4 drop-shadow-2xl">
            GAME OVER
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 italic max-w-md mx-auto">
            "{epitaph}"
          </p>
        </div>

        {/* Run Summary */}
        <div className="mb-8">
          <h2 className="text-xl text-casino-gold mb-4 text-center">Final Statistics</h2>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-black/60 p-4 rounded-lg border border-gray-700">
              <div className="text-sm text-gray-400 mb-1">Highest Stage</div>
              <div className="text-3xl font-bold text-red-400">Stage {currentStage}</div>
            </div>
            <div className="bg-black/60 p-4 rounded-lg border border-gray-700">
              <div className="text-sm text-gray-400 mb-1">Peak Chips</div>
              <div className="text-3xl font-bold text-casino-gold">{runStats.peakChips}</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-black/60 p-3 rounded-lg border border-gray-700 text-center">
              <div className="text-xl font-bold text-white">{runStats.handsPlayed}</div>
              <div className="text-xs text-gray-500 uppercase">Hands</div>
            </div>
            <div className="bg-black/60 p-3 rounded-lg border border-gray-700 text-center">
              <div className="text-xl font-bold text-green-400">{stats.winRate}%</div>
              <div className="text-xs text-gray-500 uppercase">Win Rate</div>
            </div>
            <div className="bg-black/60 p-3 rounded-lg border border-gray-700 text-center">
              <div className="text-xl font-bold text-casino-gold">{runStats.bestWinStreak}</div>
              <div className="text-xs text-gray-500 uppercase">Best Streak</div>
            </div>
          </div>

          {/* Blackjacks */}
          {runStats.blackjacksHit > 0 && (
            <div className="mt-3 bg-casino-gold/10 p-3 rounded-lg border border-casino-gold-dark text-center">
              <span className="text-casino-gold font-bold">{runStats.blackjacksHit}</span>
              <span className="text-casino-gold-light ml-2">Blackjacks Hit!</span>
            </div>
          )}

          {/* Power Stats */}
          {runStats.totalPowersUsed > 0 && (
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="bg-black/60 p-3 rounded-lg border border-gray-700 text-center">
                <div className="text-xl font-bold text-casino-gold">{runStats.totalPowersUsed}</div>
                <div className="text-xs text-gray-500 uppercase">Powers Used</div>
              </div>
              <div className="bg-black/60 p-3 rounded-lg border border-gray-700 text-center">
                <div className="text-xl font-bold text-casino-gold">{runStats.totalEdgeSpent}</div>
                <div className="text-xs text-gray-500 uppercase">Edge Spent</div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setScreen('title')}
            className="w-full py-4 px-8 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xl rounded-lg shadow-xl transform hover:scale-105 transition-all duration-200 active:scale-95"
          >
            TRY AGAIN
          </button>

          <button
            onClick={() => setScreen('title')}
            className="w-full py-3 px-8 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold text-lg rounded-lg border border-gray-600 transition-all duration-200"
          >
            MAIN MENU
          </button>
        </div>
      </div>
    </div>
  );
}
