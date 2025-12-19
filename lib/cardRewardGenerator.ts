import type { Card, Rank, Suit } from '@/types/game';
import type { StarterDeckId } from '@/types/starterDecks';
import { createSpecialCard } from './specialCards';

/**
 * Phase 5: Card Reward System
 * Generate 3 random card options for player to choose from after completing a stage
 */

interface CardRewardOption {
  card: Card;
  description: string;
}

function createCard(rank: Rank, suit: Suit = 'hearts'): Card {
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
    faceUp: true,
  };
}

/**
 * Get a weighted random rank based on stage difficulty
 */
function getWeightedRank(stage: number): Rank {
  const allRanks: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  // Early stages: favor mid-value cards
  // Later stages: can offer any card
  const weights: Record<number, Record<string, number>> = {
    1: { low: 40, mid: 40, high: 20 }, // Stages 1-2
    3: { low: 30, mid: 40, high: 30 }, // Stages 3-4
    5: { low: 25, mid: 35, high: 40 }, // Stages 5-6
    7: { low: 20, mid: 30, high: 50 }, // Stages 7-8
  };

  const tierKey = stage <= 2 ? 1 : stage <= 4 ? 3 : stage <= 6 ? 5 : 7;
  const tier = weights[tierKey];

  const roll = Math.random() * 100;

  if (roll < tier.low) {
    // Low cards: 2-6
    const lowRanks: Rank[] = ['2', '3', '4', '5', '6'];
    return lowRanks[Math.floor(Math.random() * lowRanks.length)];
  } else if (roll < tier.low + tier.mid) {
    // Mid cards: 7-9, A
    const midRanks: Rank[] = ['7', '8', '9', 'A'];
    return midRanks[Math.floor(Math.random() * midRanks.length)];
  } else {
    // High cards: 10, J, Q, K
    const highRanks: Rank[] = ['10', 'J', 'Q', 'K'];
    return highRanks[Math.floor(Math.random() * highRanks.length)];
  }
}

/**
 * Get a random suit
 */
function getRandomSuit(): Suit {
  const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
  return suits[Math.floor(Math.random() * suits.length)];
}

/**
 * Get description for a card based on its value and context
 */
function getCardDescription(card: Card, deckId: StarterDeckId | null): string {
  if (card.special === 'wild') {
    return 'Gambler exclusive: Choose its rank when drawn';
  }
  if (card.special === 'golden') {
    return 'Gambler exclusive: +2 chips when in opening hand';
  }

  const value = card.value;
  const rank = card.rank;

  // Deck-specific synergies
  if (deckId === 'grinder' && value <= 6) {
    return 'Perfect for Grinder: More safe hits, more Slow Burn triggers';
  }
  if (deckId === 'highRoller' && value >= 10) {
    return 'Perfect for High Roller: Easier to hit 20-21 for Power Stance';
  }
  if (deckId === 'aceHunter' && rank === 'A') {
    return 'Perfect for Ace Master: More Blackjacks = more 2:1 payouts';
  }

  // General descriptions
  if (rank === 'A') {
    return 'Versatile: Count as 1 or 11, key for Blackjacks';
  }
  if (value === 10) {
    return 'High-value card: Strong for hitting 20-21';
  }
  if (value <= 6) {
    return 'Safe card: Hit without much bust risk';
  }
  return 'Mid-value card: Balanced utility';
}

/**
 * Generate 3 random card reward options
 */
export function generateCardRewards(
  stage: number,
  deckId: StarterDeckId | null
): CardRewardOption[] {
  const options: CardRewardOption[] = [];

  // Generate 3 unique cards
  const usedRanks = new Set<Rank>();

  for (let i = 0; i < 3; i++) {
    let rank: Rank;
    let attempts = 0;

    // Try to get a unique rank
    do {
      rank = getWeightedRank(stage);
      attempts++;
    } while (usedRanks.has(rank) && attempts < 10);

    usedRanks.add(rank);
    const suit = getRandomSuit();
    const card = createCard(rank, suit);

    options.push({
      card,
      description: getCardDescription(card, deckId),
    });
  }

  // Special case: Gambler deck has 10% chance to offer special card in stages 3+
  if (deckId === 'gambler' && stage >= 3 && Math.random() < 0.1) {
    const specialType = Math.random() < 0.5 ? 'wild' : 'golden';
    const specialCard = createSpecialCard(specialType, getRandomSuit());

    // Replace last option with special card
    options[2] = {
      card: specialCard,
      description: getCardDescription(specialCard, deckId),
    };
  }

  return options;
}
