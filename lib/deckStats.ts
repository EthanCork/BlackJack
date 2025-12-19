import type { StarterDeckId } from '@/types/starterDecks';
import type { RunStats } from '@/types/game';

/**
 * Phase 5: Deck-Specific Statistics Tracking
 * Track performance metrics for each individual deck
 */

export interface DeckStats {
  deckId: StarterDeckId;
  runsPlayed: number;
  victories: number;
  totalStagesReached: number;
  averageStageReached: number;
  highestStageReached: number;
  totalHandsWon: number;
  totalHandsLost: number;
  winRate: number;
  blackjacksHit: number;
  bestChipCount: number;
  fastestVictoryMs: number;
  traitTriggersTotal: number;
  lastPlayedAt: number;
}

const DECK_STATS_KEY = 'blackjack_deck_stats';

/**
 * Get default stats for a deck
 */
function getDefaultDeckStats(deckId: StarterDeckId): DeckStats {
  return {
    deckId,
    runsPlayed: 0,
    victories: 0,
    totalStagesReached: 0,
    averageStageReached: 0,
    highestStageReached: 0,
    totalHandsWon: 0,
    totalHandsLost: 0,
    winRate: 0,
    blackjacksHit: 0,
    bestChipCount: 0,
    fastestVictoryMs: 0,
    traitTriggersTotal: 0,
    lastPlayedAt: 0,
  };
}

/**
 * Load all deck stats from localStorage
 */
export function loadAllDeckStats(): Record<StarterDeckId, DeckStats> {
  if (typeof window === 'undefined') {
    const decks: StarterDeckId[] = ['grinder', 'highRoller', 'aceHunter', 'gambler', 'survivor'];
    const stats: Record<string, DeckStats> = {};
    decks.forEach(id => {
      stats[id] = getDefaultDeckStats(id);
    });
    return stats as Record<StarterDeckId, DeckStats>;
  }

  try {
    const saved = localStorage.getItem(DECK_STATS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Failed to load deck stats:', error);
  }

  // Return defaults if nothing saved
  const decks: StarterDeckId[] = ['grinder', 'highRoller', 'aceHunter', 'gambler', 'survivor'];
  const stats: Record<string, DeckStats> = {};
  decks.forEach(id => {
    stats[id] = getDefaultDeckStats(id);
  });
  return stats as Record<StarterDeckId, DeckStats>;
}

/**
 * Save all deck stats to localStorage
 */
export function saveAllDeckStats(stats: Record<StarterDeckId, DeckStats>): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(DECK_STATS_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error('Failed to save deck stats:', error);
  }
}

/**
 * Update stats for a specific deck after a run
 */
export function updateDeckStats(
  deckId: StarterDeckId,
  runStats: RunStats,
  currentStage: number,
  finalChips: number,
  runDurationMs: number,
  traitTriggers: number,
  allStats: Record<StarterDeckId, DeckStats>
): Record<StarterDeckId, DeckStats> {
  const deckStats = allStats[deckId] || getDefaultDeckStats(deckId);
  const isVictory = currentStage >= 8;

  const newTotalStages = deckStats.totalStagesReached + currentStage;
  const newRunsPlayed = deckStats.runsPlayed + 1;
  const newTotalHandsWon = deckStats.totalHandsWon + runStats.handsWon;
  const newTotalHandsLost = deckStats.totalHandsLost + runStats.handsLost;
  const totalHands = newTotalHandsWon + newTotalHandsLost;

  const updatedStats: DeckStats = {
    ...deckStats,
    runsPlayed: newRunsPlayed,
    victories: deckStats.victories + (isVictory ? 1 : 0),
    totalStagesReached: newTotalStages,
    averageStageReached: newTotalStages / newRunsPlayed,
    highestStageReached: Math.max(deckStats.highestStageReached, currentStage),
    totalHandsWon: newTotalHandsWon,
    totalHandsLost: newTotalHandsLost,
    winRate: totalHands > 0 ? (newTotalHandsWon / totalHands) * 100 : 0,
    blackjacksHit: deckStats.blackjacksHit + runStats.blackjacksHit,
    bestChipCount: Math.max(deckStats.bestChipCount, finalChips),
    fastestVictoryMs: isVictory && (deckStats.fastestVictoryMs === 0 || runDurationMs < deckStats.fastestVictoryMs)
      ? runDurationMs
      : deckStats.fastestVictoryMs,
    traitTriggersTotal: deckStats.traitTriggersTotal + traitTriggers,
    lastPlayedAt: Date.now(),
  };

  const newAllStats = {
    ...allStats,
    [deckId]: updatedStats,
  };

  saveAllDeckStats(newAllStats);
  return newAllStats;
}

/**
 * Get formatted stats for display
 */
export function getFormattedDeckStats(stats: DeckStats): {
  winRate: string;
  avgStage: string;
  victoriesText: string;
  bestRun: string;
} {
  return {
    winRate: stats.winRate.toFixed(1) + '%',
    avgStage: stats.averageStageReached.toFixed(1),
    victoriesText: `${stats.victories}/${stats.runsPlayed}`,
    bestRun: stats.highestStageReached > 0 ? `Stage ${stats.highestStageReached}` : 'None',
  };
}

/**
 * Get comparative ranking (how this deck compares to others)
 */
export function getDeckRanking(
  deckId: StarterDeckId,
  allStats: Record<StarterDeckId, DeckStats>
): {
  rank: number;
  totalDecks: number;
  isTopPerformer: boolean;
} {
  const decks = Object.values(allStats);
  const sortedByWinRate = [...decks].sort((a, b) => b.winRate - a.winRate);

  const rank = sortedByWinRate.findIndex(s => s.deckId === deckId) + 1;

  return {
    rank,
    totalDecks: decks.length,
    isTopPerformer: rank === 1 && decks.length > 1,
  };
}

/**
 * Format time duration
 */
export function formatDuration(ms: number): string {
  if (ms === 0) return 'N/A';

  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);

  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
