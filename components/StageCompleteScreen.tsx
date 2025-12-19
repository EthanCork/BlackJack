'use client';

import { useGameStore } from '@/store/gameStore';
import { getStage } from '@/lib/stages';
import { formatStats } from '@/lib/stats';

export default function StageCompleteScreen() {
  const { currentStage, runStats, advanceStage } = useGameStore();

  const stage = getStage(currentStage);
  const stats = formatStats(runStats);

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-500">
      <div className="max-w-2xl w-full bg-gradient-to-b from-gray-900 to-black border-2 border-casino-gold rounded-2xl p-8 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block px-6 py-2 bg-casino-gold/20 rounded-full mb-4">
            <span className="text-casino-gold text-sm uppercase tracking-widest">Stage {currentStage}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-casino-gold mb-2 animate-shimmer">
            STAGE CLEARED!
          </h1>
          <p className="text-xl text-casino-gold-light">
            {stage.name} conquered
          </p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-black/40 p-4 rounded-lg border border-casino-gold-dark text-center">
            <div className="text-2xl font-bold text-casino-gold">{runStats.handsPlayed}</div>
            <div className="text-xs text-gray-400 uppercase">Hands Played</div>
          </div>
          <div className="bg-black/40 p-4 rounded-lg border border-casino-gold-dark text-center">
            <div className="text-2xl font-bold text-green-400">{stats.winRate}%</div>
            <div className="text-xs text-gray-400 uppercase">Win Rate</div>
          </div>
          <div className="bg-black/40 p-4 rounded-lg border border-casino-gold-dark text-center col-span-2 sm:col-span-1">
            <div className="text-2xl font-bold text-casino-gold">{runStats.blackjacksHit}</div>
            <div className="text-xs text-gray-400 uppercase">Blackjacks</div>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={advanceStage}
          className="w-full py-5 px-8 bg-gradient-to-r from-casino-gold to-casino-gold-light hover:from-casino-gold-light hover:to-casino-gold text-black font-bold text-2xl rounded-lg shadow-2xl transform hover:scale-105 transition-all duration-200 active:scale-95"
        >
          CONTINUE TO STAGE {currentStage + 1}
        </button>

        {/* Next Stage Preview */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Next: {getStage(currentStage + 1).name} • {getStage(currentStage + 1).winsRequired} wins required
        </div>
      </div>
    </div>
  );
}
