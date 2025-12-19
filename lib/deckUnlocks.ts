import type { StarterDeckId, DeckUnlockStatus } from '@/types/starterDecks';

/**
 * Phase 5: Deck Unlock System
 *
 * Unlocking Decks:
 * - Grinder: Always unlocked (starting deck)
 * - High Roller: Win 3 runs with any deck OR 500 Dust
 * - Ace Master: Get 10 blackjacks in a single run OR 750 Dust
 * - Gambler: Reach stage 5 with any deck OR 1000 Dust
 * - Foundation: Clear all 8 stages (victory) OR 1500 Dust
 */

export const DECK_UNLOCK_COSTS: Record<StarterDeckId, number> = {
  grinder: 0,        // Always unlocked
  highRoller: 500,   // Win 3 runs OR 500 Dust
  aceHunter: 750,    // 10 blackjacks in one run OR 750 Dust
  gambler: 1000,     // Reach stage 5 OR 1000 Dust
  survivor: 1500,    // Complete victory OR 1500 Dust
};

export interface DeckUnlockRequirement {
  deckId: StarterDeckId;
  name: string;
  description: string;
  dustCost: number;
  achievementDescription: string;
  checkUnlock: (stats: any) => boolean;
}

export const DECK_UNLOCK_REQUIREMENTS: Record<StarterDeckId, DeckUnlockRequirement> = {
  grinder: {
    deckId: 'grinder',
    name: 'The Grinder',
    description: 'Always unlocked - your starting deck',
    dustCost: 0,
    achievementDescription: 'Default',
    checkUnlock: () => true,
  },
  highRoller: {
    deckId: 'highRoller',
    name: 'The High Roller',
    description: 'Unlock by winning 3 runs with any deck',
    dustCost: 500,
    achievementDescription: 'Win 3 runs',
    checkUnlock: (stats) => (stats?.totalVictories || 0) >= 3,
  },
  aceHunter: {
    deckId: 'aceHunter',
    name: 'The Ace Master',
    description: 'Unlock by getting 10+ blackjacks in a single run',
    dustCost: 750,
    achievementDescription: 'Get 10 blackjacks in one run',
    checkUnlock: (stats) => (stats?.mostBlackjacksInRun || 0) >= 10,
  },
  gambler: {
    deckId: 'gambler',
    name: 'The Gambler',
    description: 'Unlock by reaching stage 5 with any deck',
    dustCost: 1000,
    achievementDescription: 'Reach stage 5',
    checkUnlock: (stats) => (stats?.highestStageReached || 0) >= 5,
  },
  survivor: {
    deckId: 'survivor',
    name: 'The Foundation',
    description: 'Unlock by completing a full victory (all 8 stages)',
    dustCost: 1500,
    achievementDescription: 'Win a complete run',
    checkUnlock: (stats) => (stats?.totalVictories || 0) >= 1,
  },
};

/**
 * Local storage key for deck unlocks
 */
const DECK_UNLOCKS_KEY = 'blackjack_deck_unlocks';

/**
 * Load deck unlock status from localStorage
 */
export function loadDeckUnlocks(): Record<StarterDeckId, DeckUnlockStatus> {
  if (typeof window === 'undefined') {
    // SSR: Return default unlocks
    return getDefaultUnlocks();
  }

  try {
    const saved = localStorage.getItem(DECK_UNLOCKS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Failed to load deck unlocks:', error);
  }

  return getDefaultUnlocks();
}

/**
 * Save deck unlock status to localStorage
 */
export function saveDeckUnlocks(unlocks: Record<StarterDeckId, DeckUnlockStatus>): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(DECK_UNLOCKS_KEY, JSON.stringify(unlocks));
  } catch (error) {
    console.error('Failed to save deck unlocks:', error);
  }
}

/**
 * Get default unlock status (only Grinder unlocked)
 */
function getDefaultUnlocks(): Record<StarterDeckId, DeckUnlockStatus> {
  const decks: StarterDeckId[] = ['grinder', 'highRoller', 'aceHunter', 'gambler', 'survivor'];
  const unlocks: Record<string, DeckUnlockStatus> = {};

  decks.forEach(deckId => {
    unlocks[deckId] = {
      deckId,
      unlocked: deckId === 'grinder', // Only Grinder starts unlocked
      unlockedVia: deckId === 'grinder' ? 'achievement' : undefined,
      unlockedAt: deckId === 'grinder' ? Date.now() : undefined,
    };
  });

  return unlocks as Record<StarterDeckId, DeckUnlockStatus>;
}

/**
 * Check if a deck is unlocked
 */
export function isDeckUnlocked(
  deckId: StarterDeckId,
  unlocks: Record<StarterDeckId, DeckUnlockStatus>
): boolean {
  return unlocks[deckId]?.unlocked || false;
}

/**
 * Unlock a deck (via achievement or dust)
 */
export function unlockDeck(
  deckId: StarterDeckId,
  method: 'achievement' | 'dust',
  unlocks: Record<StarterDeckId, DeckUnlockStatus>
): Record<StarterDeckId, DeckUnlockStatus> {
  const newUnlocks = { ...unlocks };

  newUnlocks[deckId] = {
    deckId,
    unlocked: true,
    unlockedVia: method,
    unlockedAt: Date.now(),
  };

  saveDeckUnlocks(newUnlocks);
  return newUnlocks;
}

/**
 * Check and auto-unlock decks based on player stats
 */
export function checkAutoUnlocks(
  stats: any,
  currentUnlocks: Record<StarterDeckId, DeckUnlockStatus>
): { unlocked: StarterDeckId[]; newUnlocks: Record<StarterDeckId, DeckUnlockStatus> } {
  const newUnlocks = { ...currentUnlocks };
  const unlocked: StarterDeckId[] = [];

  Object.values(DECK_UNLOCK_REQUIREMENTS).forEach(requirement => {
    // Skip if already unlocked
    if (currentUnlocks[requirement.deckId]?.unlocked) return;

    // Check if requirements are met
    if (requirement.checkUnlock(stats)) {
      newUnlocks[requirement.deckId] = {
        deckId: requirement.deckId,
        unlocked: true,
        unlockedVia: 'achievement',
        unlockedAt: Date.now(),
      };
      unlocked.push(requirement.deckId);
    }
  });

  if (unlocked.length > 0) {
    saveDeckUnlocks(newUnlocks);
  }

  return { unlocked, newUnlocks };
}

/**
 * Get progress towards unlocking a deck
 */
export function getUnlockProgress(deckId: StarterDeckId, stats: any): {
  current: number;
  required: number;
  percentage: number;
  description: string;
} {
  const requirement = DECK_UNLOCK_REQUIREMENTS[deckId];

  switch (deckId) {
    case 'highRoller':
      return {
        current: stats?.totalVictories || 0,
        required: 3,
        percentage: Math.min(100, ((stats?.totalVictories || 0) / 3) * 100),
        description: `${stats?.totalVictories || 0}/3 victories`,
      };

    case 'aceHunter':
      return {
        current: stats?.mostBlackjacksInRun || 0,
        required: 10,
        percentage: Math.min(100, ((stats?.mostBlackjacksInRun || 0) / 10) * 100),
        description: `${stats?.mostBlackjacksInRun || 0}/10 blackjacks in one run`,
      };

    case 'gambler':
      return {
        current: stats?.highestStageReached || 0,
        required: 5,
        percentage: Math.min(100, ((stats?.highestStageReached || 0) / 5) * 100),
        description: `Reached stage ${stats?.highestStageReached || 0}/5`,
      };

    case 'survivor':
      return {
        current: stats?.totalVictories || 0,
        required: 1,
        percentage: (stats?.totalVictories || 0) >= 1 ? 100 : 0,
        description: stats?.totalVictories ? 'Complete!' : 'Win a full run',
      };

    default:
      return {
        current: 1,
        required: 1,
        percentage: 100,
        description: 'Unlocked',
      };
  }
}
