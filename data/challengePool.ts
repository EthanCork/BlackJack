import type { Challenge } from '@/types/challenges';

// Complete challenge pool for Phase 4

export const CHALLENGE_POOL: Record<string, Challenge> = {
  // ============================================================================
  // ECONOMY CHALLENGES
  // ============================================================================

  highStakes: {
    id: 'highStakes',
    name: 'High Stakes',
    description: 'Minimum bet is 15 chips instead of 5',
    icon: '🔥',
    category: 'economy',
    removeCost: 12,
    effectData: { minBet: 15 },
  },

  taxCollector: {
    id: 'taxCollector',
    name: 'Tax Collector',
    description: 'Lose 5 chips at the start of the stage',
    icon: '💸',
    category: 'economy',
    removeCost: 8,
    effectData: { chipLoss: 5 },
  },

  inflation: {
    id: 'inflation',
    name: 'Inflation',
    description: 'Deck Shop cards cost double this stage',
    icon: '📈',
    category: 'economy',
    removeCost: 10,
    effectData: { costMultiplier: 2 },
  },

  winnersTax: {
    id: 'winnersTax',
    name: "Winner's Tax",
    description: 'All wins pay 10% less (rounded down)',
    icon: '🏛️',
    category: 'economy',
    removeCost: 15,
    effectData: { winMultiplier: 0.9 },
  },

  // ============================================================================
  // RULE CHALLENGES
  // ============================================================================

  noDoubles: {
    id: 'noDoubles',
    name: 'No Doubles',
    description: 'Double Down action is disabled this stage',
    icon: '🚫',
    category: 'rules',
    removeCost: 14,
  },

  noSplits: {
    id: 'noSplits',
    name: 'No Splits',
    description: 'Split action is disabled this stage',
    icon: '✋',
    category: 'rules',
    removeCost: 12,
  },

  shortStack: {
    id: 'shortStack',
    name: 'Short Stack',
    description: 'Maximum hand size is 4 cards (bust if you would draw 5th)',
    icon: '📏',
    category: 'rules',
    removeCost: 16,
    effectData: { maxHandSize: 4 },
  },

  dealersAdvantage: {
    id: 'dealersAdvantage',
    name: "Dealer's Advantage",
    description: 'Dealer stands on soft 17 AND wins all pushes',
    icon: '👔',
    category: 'rules',
    removeCost: 20,
  },

  // ============================================================================
  // CARD CHALLENGES
  // ============================================================================

  coldDeck: {
    id: 'coldDeck',
    name: 'Cold Deck',
    description: 'First two hands, your cards are dealt face-down (blind play)',
    icon: '❄️',
    category: 'cards',
    removeCost: 18,
    effectData: { blindHandsCount: 2 },
  },

  poisonCards: {
    id: 'poisonCards',
    name: 'Poison Cards',
    description: 'Two random cards in deck cost 3 chips when drawn',
    icon: '☠️',
    category: 'cards',
    removeCost: 14,
    effectData: { chipCost: 3, cardCount: 2 },
  },

  heavyKings: {
    id: 'heavyKings',
    name: 'Heavy Kings',
    description: 'Drawing a King costs 5 chips',
    icon: '👑',
    category: 'cards',
    removeCost: 10,
    effectData: { chipCost: 5 },
  },

  cursedAce: {
    id: 'cursedAce',
    name: 'Cursed Ace',
    description: 'One Ace in the deck counts as 1 only (never 11)',
    icon: '🂱',
    category: 'cards',
    removeCost: 12,
  },

  // ============================================================================
  // POWER CHALLENGES
  // ============================================================================

  edgeDrain: {
    id: 'edgeDrain',
    name: 'Edge Drain',
    description: 'All powers cost +1 Edge this stage',
    icon: '⚡',
    category: 'powers',
    removeCost: 15,
    effectData: { edgeCostIncrease: 1 },
  },

  powerBlock: {
    id: 'powerBlock',
    name: 'Power Block',
    description: 'One random equipped power is disabled this stage',
    icon: '🔒',
    category: 'powers',
    removeCost: 18,
  },

  slowCharge: {
    id: 'slowCharge',
    name: 'Slow Charge',
    description: 'Edge only regenerates on wins (not losses or pushes)',
    icon: '🐌',
    category: 'powers',
    removeCost: 16,
  },
};

// Helper functions
export function getChallengesForStage(stage: number): number {
  if (stage <= 3) return 0;
  if (stage <= 5) return 1;
  if (stage <= 7) return 2;
  return 3; // Stage 8
}

export function getRandomChallenges(count: number, excludeIds: string[] = []): Challenge[] {
  const available = Object.values(CHALLENGE_POOL).filter(
    c => !excludeIds.includes(c.id)
  );

  // Shuffle and take first `count`
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function calculateRemoveAllDiscount(challenges: Challenge[]): number {
  const total = challenges.reduce((sum, c) => sum + c.removeCost, 0);
  return Math.floor(total * 0.9); // 10% discount
}
