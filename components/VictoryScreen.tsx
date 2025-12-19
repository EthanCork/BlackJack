'use client';

import { useGameStore } from '@/store/gameStore';
import { formatStats } from '@/lib/stats';

export default function VictoryScreen() {
  const { chips, runStats, setScreen } = useGameStore();

  const stats = formatStats(runStats);

  // Check for achievement badges
  const hasPerfectStage = runStats.handsLost === 0;
  const hasMultipleBlackjacks = runStats.blackjacksHit >= 5;
  const hasLongStreak = runStats.bestWinStreak >= 10;
  const hasHighChips = chips >= 200;

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-yellow-950/30 via-black to-black backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-700">
      {/* Celebratory background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 text-6xl text-casino-gold animate-ping">♠</div>
        <div className="absolute top-20 right-20 text-6xl text-casino-gold animate-ping" style={{ animationDelay: '0.2s' }}>♥</div>
        <div className="absolute bottom-20 left-1/4 text-6xl text-casino-gold animate-ping" style={{ animationDelay: '0.4s' }}>♣</div>
        <div className="absolute bottom-10 right-1/3 text-6xl text-casino-gold animate-ping" style={{ animationDelay: '0.6s' }}>♦</div>
      </div>

      <div className="max-w-3xl w-full bg-gradient-to-b from-casino-gold/10 via-gray-900 to-black border-2 border-casino-gold rounded-2xl p-8 shadow-2xl relative z-10 animate-shimmer">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block px-8 py-3 bg-casino-gold/30 rounded-full mb-6">
            <span className="text-casino-gold text-lg uppercase tracking-widest font-bold">All Stages Cleared</span>
          </div>
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold text-casino-gold mb-4 drop-shadow-2xl animate-pulse">
            VICTORY!
          </h1>
          <p className="text-xl sm:text-2xl text-casino-gold-light mb-4">
            You conquered the Ascent!
          </p>
          <div className="text-4xl font-bold text-white">
            Final Chips: <span className="text-casino-gold">{chips}</span>
          </div>
        </div>

        {/* Achievement Badges */}
        {(hasPerfectStage || hasMultipleBlackjacks || hasLongStreak || hasHighChips) && (
          <div className="mb-8">
            <h2 className="text-center text-casino-gold mb-4 text-lg uppercase tracking-wide">Achievements</h2>
            <div className="grid grid-cols-2 gap-3">
              {hasPerfectStage && (
                <div className="bg-casino-gold/20 p-3 rounded-lg border-2 border-casino-gold text-center">
                  <div className="text-2xl mb-1">🏆</div>
                  <div className="text-sm font-bold text-casino-gold">Perfect Run</div>
                  <div className="text-xs text-gray-400">No losses</div>
                </div>
              )}
              {hasMultipleBlackjacks && (
                <div className="bg-casino-gold/20 p-3 rounded-lg border-2 border-casino-gold text-center">
                  <div className="text-2xl mb-1">♠️</div>
                  <div className="text-sm font-bold text-casino-gold">Blackjack Master</div>
                  <div className="text-xs text-gray-400">{runStats.blackjacksHit} blackjacks</div>
                </div>
              )}
              {hasLongStreak && (
                <div className="bg-casino-gold/20 p-3 rounded-lg border-2 border-casino-gold text-center">
                  <div className="text-2xl mb-1">🔥</div>
                  <div className="text-sm font-bold text-casino-gold">On Fire</div>
                  <div className="text-xs text-gray-400">{runStats.bestWinStreak} win streak</div>
                </div>
              )}
              {hasHighChips && (
                <div className="bg-casino-gold/20 p-3 rounded-lg border-2 border-casino-gold text-center">
                  <div className="text-2xl mb-1">💰</div>
                  <div className="text-sm font-bold text-casino-gold">High Roller</div>
                  <div className="text-xs text-gray-400">{chips} chips</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Complete Stats */}
        <div className="mb-8">
          <h2 className="text-center text-casino-gold mb-4 text-lg uppercase tracking-wide">Final Statistics</h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <div className="bg-black/60 p-4 rounded-lg border border-casino-gold-dark text-center">
              <div className="text-2xl font-bold text-white">{runStats.handsPlayed}</div>
              <div className="text-xs text-gray-400 uppercase">Hands</div>
            </div>
            <div className="bg-black/60 p-4 rounded-lg border border-casino-gold-dark text-center">
              <div className="text-2xl font-bold text-green-400">{stats.winRate}%</div>
              <div className="text-xs text-gray-400 uppercase">Win Rate</div>
            </div>
            <div className="bg-black/60 p-4 rounded-lg border border-casino-gold-dark text-center">
              <div className="text-2xl font-bold text-casino-gold">{runStats.blackjacksHit}</div>
              <div className="text-xs text-gray-400 uppercase">Blackjacks</div>
            </div>
            <div className="bg-black/60 p-4 rounded-lg border border-casino-gold-dark text-center">
              <div className="text-2xl font-bold text-orange-400">{runStats.bestWinStreak}</div>
              <div className="text-xs text-gray-400 uppercase">Best Streak</div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-black/60 p-3 rounded-lg border border-casino-gold-dark text-center">
              <div className="text-lg font-bold text-white">{runStats.peakChips}</div>
              <div className="text-xs text-gray-400 uppercase">Peak Chips</div>
            </div>
            <div className="bg-black/60 p-3 rounded-lg border border-casino-gold-dark text-center">
              <div className="text-lg font-bold text-white">{runStats.stagesCleared}</div>
              <div className="text-xs text-gray-400 uppercase">Stages Cleared</div>
            </div>
            <div className="bg-black/60 p-3 rounded-lg border border-casino-gold-dark text-center">
              <div className="text-lg font-bold text-casino-gold">{runStats.totalPowersUsed}</div>
              <div className="text-xs text-gray-400 uppercase">Powers Used</div>
            </div>
            <div className="bg-black/60 p-3 rounded-lg border border-casino-gold-dark text-center">
              <div className="text-lg font-bold text-casino-gold">{runStats.totalEdgeSpent}</div>
              <div className="text-xs text-gray-400 uppercase">Edge Spent</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setScreen('title')}
            className="w-full py-5 px-8 bg-gradient-to-r from-casino-gold to-casino-gold-light hover:from-casino-gold-light hover:to-casino-gold text-black font-bold text-2xl rounded-lg shadow-2xl transform hover:scale-105 transition-all duration-200 active:scale-95"
          >
            PLAY AGAIN
          </button>

          <button
            onClick={() => setScreen('title')}
            className="w-full py-3 px-8 bg-gray-800 hover:bg-gray-700 text-casino-gold-light font-semibold text-lg rounded-lg border border-casino-gold-dark transition-all duration-200"
          >
            MAIN MENU
          </button>
        </div>
      </div>
    </div>
  );
}
