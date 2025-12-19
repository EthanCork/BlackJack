import type { Relic, RelicTier } from '@/types/relics';

// Complete relic pool for Phase 4

export const RELIC_POOL: Record<string, Relic> = {
  // ============================================================================
  // TIER 1 RELICS (Common)
  // ============================================================================

  luckyChip: {
    id: 'luckyChip',
    name: 'Lucky Chip',
    description: '+5 bonus chips at the start of each stage',
    icon: '🍀',
    tier: 1,
    trigger: 'stageStart',
  },

  chipMagnet: {
    id: 'chipMagnet',
    name: 'Chip Magnet',
    description: '+2 bonus chips on every winning hand',
    icon: '🧲',
    tier: 1,
    trigger: 'onWin',
  },

  cushionedFall: {
    id: 'cushionedFall',
    name: 'Cushioned Fall',
    description: 'First loss each stage refunds 50% of bet',
    icon: '🛋️',
    tier: 1,
    trigger: 'onLoss',
    usesPerStage: 1,
  },

  fastLearner: {
    id: 'fastLearner',
    name: 'Fast Learner',
    description: '+1 bonus Edge regeneration per hand (total +2 per hand)',
    icon: '📚',
    tier: 1,
    trigger: 'onHandEnd',
  },

  dealersLipread: {
    id: 'dealersLipread',
    name: "Dealer's Lipread",
    description: 'When dealer shows 5 or 6, see their hole card automatically',
    icon: '👄',
    tier: 1,
    trigger: 'onDeal',
  },

  blackjackBonus: {
    id: 'blackjackBonus',
    name: 'Blackjack Bonus',
    description: 'Blackjacks pay 2:1 instead of 3:2',
    icon: '🎰',
    tier: 1,
    trigger: 'onBlackjack',
  },

  // ============================================================================
  // TIER 2 RELICS (Uncommon)
  // ============================================================================

  weightedDice: {
    id: 'weightedDice',
    name: 'Weighted Dice',
    description: 'Your first card each hand has +1 value (max 10)',
    icon: '🎲',
    tier: 2,
    trigger: 'onDeal',
    effectData: { valueBonus: 1 },
  },

  insurancePolicy: {
    id: 'insurancePolicy',
    name: 'Insurance Policy',
    description: 'All pushes (ties) count as wins',
    icon: '📋',
    tier: 2,
    trigger: 'passive',
  },

  doubleOrNothing: {
    id: 'doubleOrNothing',
    name: 'Double or Nothing',
    description: 'Double downs pay 3:1 instead of 2:1, but cost double the bet',
    icon: '⚡',
    tier: 2,
    trigger: 'onDouble',
  },

  splitSavings: {
    id: 'splitSavings',
    name: 'Split Savings',
    description: 'Split hands cost 50% bet instead of full bet for second hand',
    icon: '✂️',
    tier: 2,
    trigger: 'onSplit',
  },

  edgeLord: {
    id: 'edgeLord',
    name: 'Edge Lord',
    description: '+2 maximum Edge capacity, +1 Edge on stage clear (total +3)',
    icon: '⚔️',
    tier: 2,
    trigger: 'passive',
    effectData: { maxEdgeBonus: 2, stageClearBonus: 1 },
  },

  momentum: {
    id: 'momentum',
    name: 'Momentum',
    description: 'Each consecutive win grants +1 chip bonus (resets on loss)',
    icon: '🔥',
    tier: 2,
    trigger: 'onWin',
  },

  // ============================================================================
  // TIER 3 RELICS (Rare)
  // ============================================================================

  aceUpSleeve: {
    id: 'aceUpSleeve',
    name: 'Ace Up Sleeve',
    description: 'Once per stage, your next card drawn is guaranteed to be an Ace',
    icon: '🂡',
    tier: 3,
    trigger: 'manual',
    usesPerStage: 1,
  },

  countersIntuition: {
    id: 'countersIntuition',
    name: "Counter's Intuition",
    description: 'Always see the count of 10-value cards remaining in deck',
    icon: '🧠',
    tier: 3,
    trigger: 'passive',
  },

  dealersCurse: {
    id: 'dealersCurse',
    name: "Dealer's Curse",
    description: 'Dealer busts on 22 as well as normal bust',
    icon: '💀',
    tier: 3,
    trigger: 'passive',
  },

  goldenRatio: {
    id: 'goldenRatio',
    name: 'Golden Ratio',
    description: 'Hands totaling exactly 21 (non-blackjack) pay 3:2 like blackjack',
    icon: '📐',
    tier: 3,
    trigger: 'passive',
  },

  phoenixFeather: {
    id: 'phoenixFeather',
    name: 'Phoenix Feather',
    description: 'Once per run, survive a hand that would drop you to 0 chips (keep 10 chips)',
    icon: '🔥',
    tier: 3,
    trigger: 'passive',
    usesPerRun: 1,
  },

  pressurePoint: {
    id: 'pressurePoint',
    name: 'Pressure Point',
    description: 'Dealer must hit on soft 17 (usually stands)',
    icon: '👊',
    tier: 3,
    trigger: 'passive',
  },

  // ============================================================================
  // TIER 4 RELICS (Legendary)
  // ============================================================================

  midasTouch: {
    id: 'midasTouch',
    name: 'Midas Touch',
    description: 'All chip gains are increased by 25%',
    icon: '👑',
    tier: 4,
    trigger: 'passive',
    effectData: { bonusMultiplier: 1.25 },
  },

  perfectMemory: {
    id: 'perfectMemory',
    name: 'Perfect Memory',
    description: 'See every card that has been dealt this stage',
    icon: '🔮',
    tier: 4,
    trigger: 'passive',
  },

  gamblersFallacy: {
    id: 'gamblersFallacy',
    name: "Gambler's Fallacy",
    description: 'After 2 consecutive losses, next hand cannot lose (push at worst)',
    icon: '🌀',
    tier: 4,
    trigger: 'passive',
  },

  chaosTheory: {
    id: 'chaosTheory',
    name: 'Chaos Theory',
    description: 'At the start of each stage, gain a random temporary relic',
    icon: '🌪️',
    tier: 4,
    trigger: 'stageStart',
  },

  timeDilation: {
    id: 'timeDilation',
    name: 'Time Dilation',
    description: 'Once per stage, after seeing your cards, you may change your bet',
    icon: '⏰',
    tier: 4,
    trigger: 'manual',
    usesPerStage: 1,
  },
};

// Helper functions
export function getRelicsByTier(tier: RelicTier): Relic[] {
  return Object.values(RELIC_POOL).filter(r => r.tier === tier);
}

export function getRandomRelics(
  count: number,
  excludeIds: string[] = [],
  allowedTiers: RelicTier[] = [1, 2, 3, 4]
): Relic[] {
  const available = Object.values(RELIC_POOL).filter(
    r => !excludeIds.includes(r.id) && allowedTiers.includes(r.tier)
  );

  // Shuffle and take first `count`
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getAllowedRelicTiersForStage(stage: number): RelicTier[] {
  if (stage <= 2) return [1];
  if (stage <= 4) return [1, 2];
  if (stage <= 6) return [1, 2, 3];
  return [1, 2, 3, 4]; // Stage 7+
}
