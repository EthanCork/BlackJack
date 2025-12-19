import type { StarterDeckId } from '@/types/starterDecks';

// Maps powers and relics to which starter decks they synergize with

export const POWER_SYNERGIES: Record<string, StarterDeckId[]> = {
  // Grinder synergies - safe hitting, low risk
  insurancePlus: ['grinder', 'survivor'],
  safetyNet: ['grinder', 'survivor'],

  // High Roller synergies - information and high value plays
  peek: ['highRoller', 'aceHunter'],
  freeze: ['highRoller'],
  stackedDeck: ['highRoller', 'aceHunter'],

  // Ace Master synergies - blackjack focus
  luckyDraw: ['aceHunter', 'gambler'],
  doubleAgent: ['aceHunter'],

  // Gambler synergies - risk/reward
  loadedDice: ['gambler'],
  swap: ['gambler', 'survivor'],

  // Universal cheap powers
  quickPeek: ['grinder', 'highRoller'],
  cardCount: ['highRoller', 'aceHunter'],
};

export const RELIC_SYNERGIES: Record<string, StarterDeckId[]> = {
  // Grinder synergies - economy and consistency
  chipMagnet: ['grinder'],
  momentum: ['grinder'],

  // High Roller synergies - high value rewards
  blackjackBonus: ['highRoller', 'aceHunter'],
  goldenRatio: ['highRoller'],

  // Ace Master synergies - blackjack and soft hands
  aceUpSleeve: ['aceHunter'],
  dealersLipread: ['aceHunter', 'highRoller'],

  // Gambler synergies - variance and chaos
  doubleOrNothing: ['gambler'],
  midasTouch: ['gambler'],
  chaosTheory: ['gambler'],

  // Foundation synergies - adaptable
  fastLearner: ['survivor'],
  cushionedFall: ['survivor', 'grinder'],
};

/**
 * Check if a power synergizes with the current deck
 */
export function isPowerSynergy(powerId: string, deckId: StarterDeckId): boolean {
  const synergies = POWER_SYNERGIES[powerId];
  return synergies ? synergies.includes(deckId) : false;
}

/**
 * Check if a relic synergizes with the current deck
 */
export function isRelicSynergy(relicId: string, deckId: StarterDeckId): boolean {
  const synergies = RELIC_SYNERGIES[relicId];
  return synergies ? synergies.includes(deckId) : false;
}

/**
 * Get synergy label for display
 */
export function getSynergyLabel(deckId: StarterDeckId): string {
  const labels: Record<StarterDeckId, string> = {
    grinder: "Grinder's Choice",
    highRoller: "High Roller's Pick",
    aceHunter: "Ace Master's Edge",
    gambler: "Gambler's Bet",
    survivor: "Foundation's Balance",
  };
  return labels[deckId];
}
