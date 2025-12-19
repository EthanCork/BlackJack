import type { RunStats, HandResult, Outcome } from '@/types/game';

/**
 * Create initial empty stats for a new run
 */
export function createInitialStats(): RunStats {
  return {
    handsPlayed: 0,
    handsWon: 0,
    handsLost: 0,
    handsPushed: 0,
    blackjacksHit: 0,
    doublesWon: 0,
    doublesLost: 0,
    splitsPlayed: 0,
    totalChipsWon: 0,
    totalChipsLost: 0,
    peakChips: 50, // Starting chips
    currentWinStreak: 0,
    bestWinStreak: 0,
    currentLoseStreak: 0,
    worstLoseStreak: 0,
    highestStageReached: 1,
    stagesCleared: 0,
    // Phase 3: Power stats
    totalEdgeSpent: 0,
    totalPowersUsed: 0,
    powerUsageCount: {},
    clutchSaves: 0,

    // Phase 4: Deck stats
    specialCardsCollected: 0,
    specialCardNames: [],
    cardsRemoved: 0,
    cardsAdded: 0,
    cardsTransformed: 0,

    // Phase 4: Challenge stats
    challengesFaced: 0,
    challengesRemoved: 0,
    challengesSurvived: 0,

    // Phase 4: Boss stats
    bossesDefeated: 0,

    // Phase 4: Economy stats
    chipsSpentOnDeck: 0,
    chipsSpentOnChallenges: 0,
  };
}

/**
 * Update stats with a hand result
 */
export function updateStatsWithHandResult(
  stats: RunStats,
  result: HandResult,
  currentChips: number
): RunStats {
  const newStats = { ...stats };

  // Increment hands played
  newStats.handsPlayed += 1;

  // Update outcome counts
  if (result.outcome === 'win' || result.outcome === 'blackjack') {
    newStats.handsWon += 1;
    newStats.currentWinStreak += 1;
    newStats.currentLoseStreak = 0;
    newStats.bestWinStreak = Math.max(newStats.bestWinStreak, newStats.currentWinStreak);
  } else if (result.outcome === 'lose') {
    newStats.handsLost += 1;
    newStats.currentLoseStreak += 1;
    newStats.currentWinStreak = 0;
    newStats.worstLoseStreak = Math.max(newStats.worstLoseStreak, newStats.currentLoseStreak);
  } else if (result.outcome === 'push') {
    newStats.handsPushed += 1;
  }

  // Blackjack tracking
  if (result.outcome === 'blackjack') {
    newStats.blackjacksHit += 1;
  }

  // Double tracking
  if (result.hadDouble) {
    if (result.outcome === 'win' || result.outcome === 'blackjack') {
      newStats.doublesWon += 1;
    } else if (result.outcome === 'lose') {
      newStats.doublesLost += 1;
    }
  }

  // Split tracking
  if (result.hadSplit) {
    newStats.splitsPlayed += 1;
  }

  // Economy tracking
  if (result.chipChange > 0) {
    newStats.totalChipsWon += result.chipChange;
  } else if (result.chipChange < 0) {
    newStats.totalChipsLost += Math.abs(result.chipChange);
  }

  // Peak chips
  newStats.peakChips = Math.max(newStats.peakChips, currentChips);

  return newStats;
}

/**
 * Calculate win rate percentage
 */
export function calculateWinRate(stats: RunStats): number {
  if (stats.handsPlayed === 0) return 0;
  return Math.round((stats.handsWon / stats.handsPlayed) * 100);
}

/**
 * Get net chip change (won - lost)
 */
export function getNetChipChange(stats: RunStats): number {
  return stats.totalChipsWon - stats.totalChipsLost;
}

/**
 * Format stats for display
 */
export function formatStats(stats: RunStats) {
  return {
    ...stats,
    winRate: calculateWinRate(stats),
    netChips: getNetChipChange(stats),
  };
}
