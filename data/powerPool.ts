import type { Power } from '@/types/powers';

// All available powers in the game
export const POWER_POOL: Record<string, Power> = {
  // ============================================================================
  // TIER 1 POWERS (Common - Cost 1-2 Edge)
  // ============================================================================

  peek: {
    id: 'peek',
    name: 'Peek',
    description: 'Reveal the dealer\'s hole card for the rest of the hand',
    cost: 2,
    tier: 1,
    timing: 'playerTurn',
    icon: '👁️',
    usesPerHand: 1,
  },

  cardCount: {
    id: 'cardCount',
    name: 'Card Count',
    description: 'See how many 10-value cards remain in the deck',
    cost: 1,
    tier: 1,
    timing: 'playerTurn',
    icon: '🔢',
    usesPerHand: 1,
  },

  insurancePlus: {
    id: 'insurancePlus',
    name: 'Insurance+',
    description: 'When you bust, refund half your bet (auto-activates)',
    cost: 1,
    tier: 1,
    timing: 'onBust',
    icon: '🛡️',
    usesPerHand: 1,
    passive: true,
  },

  quickPeek: {
    id: 'quickPeek',
    name: 'Quick Peek',
    description: 'See the top card of the deck before dealing',
    cost: 1,
    tier: 1,
    timing: 'preDeal',
    icon: '👀',
    usesPerHand: 1,
  },

  // ============================================================================
  // TIER 2 POWERS (Uncommon - Cost 2-3 Edge)
  // ============================================================================

  swap: {
    id: 'swap',
    name: 'Swap',
    description: 'Exchange one card from your hand with the top card of the deck',
    cost: 3,
    tier: 2,
    timing: 'playerTurn',
    icon: '🔄',
    usesPerHand: 1,
  },

  pressure: {
    id: 'pressure',
    name: 'Pressure',
    description: 'Force the dealer to hit one additional time',
    cost: 2,
    tier: 2,
    timing: 'preDealer',
    icon: '⬇️',
    usesPerHand: 1,
  },

  luckyDraw: {
    id: 'luckyDraw',
    name: 'Lucky Draw',
    description: 'Draw 2 cards, choose 1 to add to your hand',
    cost: 3,
    tier: 2,
    timing: 'playerTurn',
    icon: '🍀',
    usesPerHand: 1,
  },

  safetyNet: {
    id: 'safetyNet',
    name: 'Safety Net',
    description: 'Remove the card that caused you to bust',
    cost: 2,
    tier: 2,
    timing: 'onBust',
    icon: '🪂',
    usesPerHand: 1,
  },

  // ============================================================================
  // TIER 3 POWERS (Rare - Cost 3-4 Edge)
  // ============================================================================

  freeze: {
    id: 'freeze',
    name: 'Freeze',
    description: 'Dealer must stand on their current total (cannot hit)',
    cost: 3,
    tier: 3,
    timing: 'preDealer',
    icon: '❄️',
    usesPerHand: 1,
  },

  secondChance: {
    id: 'secondChance',
    name: 'Second Chance',
    description: 'Undo your last action (hit, double, or split decision)',
    cost: 4,
    tier: 3,
    timing: 'playerTurn',
    icon: '⏪',
    usesPerHand: 1,
  },

  stackedDeck: {
    id: 'stackedDeck',
    name: 'Stacked Deck',
    description: 'Your first card is guaranteed to be 10-value (10, J, Q, K)',
    cost: 3,
    tier: 3,
    timing: 'preDeal',
    icon: '⭐',
    usesPerHand: 1,
  },

  dealersTell: {
    id: 'dealersTell',
    name: 'Dealer\'s Tell',
    description: 'See the dealer\'s hole card when they show 6 or less',
    cost: 2,
    tier: 3,
    timing: 'preDeal',
    icon: '😰',
    usesPerHand: 1,
    passive: true,
  },

  // ============================================================================
  // TIER 4 POWERS (Legendary - Cost 4-5 Edge)
  // ============================================================================

  loadedDice: {
    id: 'loadedDice',
    name: 'Loaded Dice',
    description: 'Both starting cards are guaranteed to be 10 or higher',
    cost: 5,
    tier: 4,
    timing: 'preDeal',
    icon: '🎲',
    usesPerHand: 1,
    usesPerStage: 1,
  },

  doubleAgent: {
    id: 'doubleAgent',
    name: 'Double Agent',
    description: 'Swap your entire hand with the dealer\'s hand',
    cost: 4,
    tier: 4,
    timing: 'playerTurn',
    icon: '🎭',
    usesPerHand: 1,
    usesPerStage: 1,
  },

  timeWarp: {
    id: 'timeWarp',
    name: 'Time Warp',
    description: 'Replay the entire hand with the same cards',
    cost: 5,
    tier: 4,
    timing: 'playerTurn', // Actually triggers after resolution, but set as playerTurn for UI
    icon: '🕐',
    usesPerRun: 1,
  },

  perfectShuffle: {
    id: 'perfectShuffle',
    name: 'Perfect Shuffle',
    description: 'Completely reshuffle the deck with new random order',
    cost: 4,
    tier: 4,
    timing: 'preDeal',
    icon: '🔀',
    usesPerHand: 1,
    usesPerStage: 1,
  },
};

// Helper to get powers by tier
export function getPowersByTier(tier: number): Power[] {
  return Object.values(POWER_POOL).filter(p => p.tier === tier);
}

// Helper to get random powers for selection
export function getRandomPowers(
  count: number,
  excludeIds: string[],
  allowedTiers: number[]
): Power[] {
  const available = Object.values(POWER_POOL).filter(
    p => !excludeIds.includes(p.id) && allowedTiers.includes(p.tier)
  );

  // Shuffle and take count
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// Helper to determine which tiers are available for a stage
export function getAllowedTiersForStage(stage: number): number[] {
  if (stage <= 3) return [1, 2];
  if (stage <= 6) return [1, 2, 3];
  return [1, 2, 3, 4]; // Stages 7-8 can offer legendary powers
}
