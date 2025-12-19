import type { StarterDeckId } from '@/types/starterDecks';

/**
 * Deck Trait System - Implements signature passive abilities for each starter deck
 *
 * Traits:
 * - Grinder: Slow Burn - Gain +1 chip when hitting and not busting
 * - High Roller: Power Stance - Gain +2 chips when standing on 20 or 21
 * - Ace Master: Ace in the Hole - Blackjacks pay 2:1 instead of 3:2
 * - Gambler: All or Nothing - Double downs pay 3:1, losses cost +25%
 * - Foundation: Adaptable - Free card swap each stage (handled in DeckShop)
 */

/**
 * Track trait state in game store
 */
export interface DeckTraitState {
  activeDeckId: StarterDeckId | null;
  slowBurnTriggersThisHand: number; // Grinder
  // Other traits don't need state tracking
}

/**
 * Check if a deck trait should trigger
 */
export function shouldTriggerSlowBurn(
  deckId: StarterDeckId | null,
  didHit: boolean,
  busted: boolean
): boolean {
  return deckId === 'grinder' && didHit && !busted;
}

export function shouldTriggerPowerStance(
  deckId: StarterDeckId | null,
  didStand: boolean,
  playerValue: number
): boolean {
  return deckId === 'highRoller' && didStand && (playerValue === 20 || playerValue === 21);
}

/**
 * Calculate trait bonuses
 */
export function calculateSlowBurnBonus(): number {
  // +1 chip per safe hit
  return 1;
}

export function calculatePowerStanceBonus(): number {
  // +2 chips when standing on 20/21
  return 2;
}

/**
 * Modify blackjack payout for Ace Master trait
 */
export function getBlackjackPayout(
  deckId: StarterDeckId | null,
  basePayout: number
): number {
  if (deckId === 'aceHunter') {
    // Ace in the Hole: 2:1 instead of 3:2
    // Standard blackjack is 1.5x bet (3:2)
    // Ace Master gets 2x bet (2:1) = 33% increase
    return 2.0;
  }
  return basePayout; // Standard 1.5
}

/**
 * Modify double down payout for Gambler trait
 */
export function getDoubleDownPayout(
  deckId: StarterDeckId | null,
  isWin: boolean,
  baseBet: number
): { payout: number; extraCost: number } {
  if (deckId === 'gambler') {
    if (isWin) {
      // All or Nothing: Wins pay 3:1 instead of 2:1
      // Standard double win: bet * 2 (you get your bet back + bet)
      // Gambler double win: bet * 3
      return { payout: baseBet * 3, extraCost: 0 };
    } else {
      // All or Nothing: Losses cost +25% of bet
      return { payout: 0, extraCost: Math.ceil(baseBet * 0.25) };
    }
  }

  // Standard double down
  if (isWin) {
    return { payout: baseBet * 2, extraCost: 0 };
  } else {
    return { payout: 0, extraCost: 0 };
  }
}

/**
 * Get trait display name
 */
export function getTraitName(deckId: StarterDeckId): string {
  const names: Record<StarterDeckId, string> = {
    grinder: 'Slow Burn',
    highRoller: 'Power Stance',
    aceHunter: 'Ace in the Hole',
    gambler: 'All or Nothing',
    survivor: 'Adaptable',
  };
  return names[deckId];
}

/**
 * Get trait description
 */
export function getTraitDescription(deckId: StarterDeckId): string {
  const descriptions: Record<StarterDeckId, string> = {
    grinder: 'When you hit and don\'t bust, gain +1 chip',
    highRoller: 'Standing on 20 or 21 grants +2 chips',
    aceHunter: 'Blackjacks pay 2:1 instead of 3:2',
    gambler: 'Double downs pay 3:1, losses cost +25% of bet',
    survivor: 'After each stage, may swap one card for any standard card',
  };
  return descriptions[deckId];
}

/**
 * Format trait trigger message for UI
 */
export function formatTraitMessage(deckId: StarterDeckId, trigger: string): string {
  const traitName = getTraitName(deckId);

  switch (deckId) {
    case 'grinder':
      return `🔥 ${traitName}: +1 chip (safe hit)`;
    case 'highRoller':
      return `💪 ${traitName}: +2 chips (standing on ${trigger})`;
    case 'aceHunter':
      return `🂡 ${traitName}: Blackjack pays 2:1!`;
    case 'gambler':
      if (trigger === 'win') {
        return `💰 ${traitName}: Double pays 3:1!`;
      } else {
        return `💰 ${traitName}: Extra penalty on double loss`;
      }
    case 'survivor':
      return `🔄 ${traitName}: Free card swap available`;
    default:
      return '';
  }
}
