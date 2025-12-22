import type { BossDealer } from '@/types/bosses';
import type { Card } from '@/types/game';

/**
 * BOSS SYSTEM - Premade Boss Decks
 * Each boss has a fixed, optimized deck designed for their strategy
 */

// Helper to create cards with standard properties
function createBossCard(rank: Card['rank'], suit: Card['suit']): Card {
  let value: number;
  if (rank === 'A') {
    value = 11;
  } else if (['J', 'Q', 'K'].includes(rank)) {
    value = 10;
  } else {
    value = parseInt(rank);
  }

  return {
    suit,
    rank,
    value,
    faceUp: false, // Will be set during gameplay
  };
}

// ============================================================================
// BOSS 1: THE PIT BOSS (Stage 4)
// ============================================================================

const PIT_BOSS_DECK: Card[] = [
  // 6s (2 cards)
  createBossCard('6', 'spades'),
  createBossCard('6', 'diamonds'),
  // 7s (3 cards)
  createBossCard('7', 'hearts'),
  createBossCard('7', 'clubs'),
  createBossCard('7', 'diamonds'),
  // 8s (3 cards)
  createBossCard('8', 'spades'),
  createBossCard('8', 'hearts'),
  createBossCard('8', 'clubs'),
  // 9s (2 cards)
  createBossCard('9', 'diamonds'),
  createBossCard('9', 'clubs'),
  // 10s (4 cards)
  createBossCard('10', 'spades'),
  createBossCard('10', 'hearts'),
  createBossCard('10', 'diamonds'),
  createBossCard('10', 'clubs'),
  // Aces (2 cards)
  createBossCard('A', 'hearts'),
  createBossCard('A', 'clubs'),
];

// ============================================================================
// BOSS 2: THE SHARK (Stage 6)
// ============================================================================

const SHARK_DECK: Card[] = [
  // 9s (2 cards)
  createBossCard('9', 'clubs'),
  createBossCard('9', 'diamonds'),
  // 10s (3 cards)
  createBossCard('10', 'spades'),
  createBossCard('10', 'hearts'),
  createBossCard('10', 'clubs'),
  // Jacks (3 cards)
  createBossCard('J', 'diamonds'),
  createBossCard('J', 'hearts'),
  createBossCard('J', 'spades'),
  // Queens (2 cards)
  createBossCard('Q', 'clubs'),
  createBossCard('Q', 'diamonds'),
  // Kings (2 cards)
  createBossCard('K', 'hearts'),
  createBossCard('K', 'spades'),
  // Aces (2 cards)
  createBossCard('A', 'clubs'),
  createBossCard('A', 'diamonds'),
];

// ============================================================================
// BOSS 3: THE HOUSE (Stage 8)
// ============================================================================

const HOUSE_DECK: Card[] = [
  // 4s (2 cards)
  createBossCard('4', 'diamonds'),
  createBossCard('4', 'clubs'),
  // 6s (2 cards)
  createBossCard('6', 'hearts'),
  createBossCard('6', 'spades'),
  // 7s (2 cards)
  createBossCard('7', 'diamonds'),
  createBossCard('7', 'clubs'),
  // 9s (2 cards)
  createBossCard('9', 'hearts'),
  createBossCard('9', 'spades'),
  // 10s (4 cards)
  createBossCard('10', 'spades'),
  createBossCard('10', 'hearts'),
  createBossCard('10', 'diamonds'),
  createBossCard('10', 'clubs'),
  // Jacks (2 cards)
  createBossCard('J', 'diamonds'),
  createBossCard('J', 'clubs'),
  // Aces (4 cards)
  createBossCard('A', 'spades'),
  createBossCard('A', 'hearts'),
  createBossCard('A', 'diamonds'),
  createBossCard('A', 'clubs'),
];

// ============================================================================
// BOSS DEFINITIONS
// ============================================================================

export const BOSS_POOL: Record<number, BossDealer> = {
  4: {
    id: 'pitBoss',
    name: 'The Pit Boss',
    stage: 4,
    title: 'Veteran Dealer',
    portrait: '👔',
    introQuote: "I've seen every trick in the book, kid. You're not special.",
    defeatQuote: "...Not bad, kid. Not bad at all.",
    specialRule: "Veteran's Patience: Ties at exactly 17 count as Pit Boss wins",

    // Premade deck
    deck: PIT_BOSS_DECK,
    deckSize: 16,

    // Boss behavior
    dealerStandValue: 17,
    dealerHitsOnSoft17: false, // Stands on soft 17
    tiesAt17AreLosses: true, // Special rule: 17 ties = boss wins
    winsNeeded: 4,

    // Rewards
    chipReward: 25,
    rareCardRewardCount: 3, // Choose 1 of 3 rare cards
  },

  6: {
    id: 'shark',
    name: 'The Shark',
    stage: 6,
    title: 'Ruthless High Roller',
    portrait: '🦈',
    introQuote: "I smell blood in the water. Let's see how long you last.",
    defeatQuote: "You got lucky. Next time... next time I'll take everything.",
    specialRule: 'Blood in the Water: Every hand you lose costs +5 extra chips',

    // Premade deck (high card heavy)
    deck: SHARK_DECK,
    deckSize: 14,

    // Boss behavior
    dealerStandValue: 17,
    dealerHitsOnSoft17: true, // Aggressive - hits soft 17
    extraChipLossOnLoss: 5, // Lose extra 5 chips per loss
    winsNeeded: 5,

    // Rewards
    chipReward: 35,
    rareCardRewardCount: 3,
    bonusReward: 'maxEdgeBoost', // +1 Max Edge permanently
  },

  8: {
    id: 'house',
    name: 'The House',
    stage: 8,
    title: 'The Final Test',
    portrait: '🏛️',
    introQuote: 'The house always wins. Always.',
    defeatQuote: '...Impossible. No one beats the house. No one...',
    specialRule: 'House Edge: All ties = House wins. Perfect Information: Hole card face up. The Rake: -10 chips at start',

    // Premade deck (perfectly balanced)
    deck: HOUSE_DECK,
    deckSize: 18,

    // Boss behavior
    dealerStandValue: 17,
    dealerHitsOnSoft17: true, // Optimal play
    playerPushesAreLosses: true, // ALL ties = House wins
    holeCardVisible: true, // Hole card face up
    startingChipPenalty: 10, // -10 chips at fight start
    winsNeeded: 6,

    // Rewards
    chipReward: 0, // Victory is the reward
    bonusReward: 'victory',
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getBossForStage(stage: number): BossDealer | null {
  return BOSS_POOL[stage] || null;
}

export function isBossStage(stage: number): boolean {
  return stage === 4 || stage === 6 || stage === 8;
}

/**
 * Get boss deck statistics for display
 */
export function getBossDeckStats(boss: BossDealer) {
  const deck = boss.deck;
  const tenValueCards = deck.filter(c => c.value === 10).length;
  const aces = deck.filter(c => c.rank === 'A').length;
  const averageValue = deck.reduce((sum, c) => sum + c.value, 0) / deck.length;

  return {
    deckSize: boss.deckSize,
    averageValue: averageValue.toFixed(2),
    tenValuePercent: Math.round((tenValueCards / deck.length) * 100),
    acePercent: Math.round((aces / deck.length) * 100),
    tenValueCards,
    aces,
  };
}

/**
 * Get breakdown of cards in boss deck for display
 */
export function getBossDeckBreakdown(boss: BossDealer): Record<string, number> {
  const breakdown: Record<string, number> = {};

  for (const card of boss.deck) {
    const key = card.rank;
    breakdown[key] = (breakdown[key] || 0) + 1;
  }

  return breakdown;
}
