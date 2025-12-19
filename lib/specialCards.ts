import type { Card, Rank, Suit, SpecialCardType } from '@/types/game';

/**
 * Phase 5: Special Card System
 *
 * Wild Card: Before dealing, choose its rank (any standard rank)
 * Golden Card: Gain +2 chips when drawn in initial deal
 */

/**
 * Create a special card
 */
export function createSpecialCard(
  type: SpecialCardType,
  suit: Suit = 'hearts',
  defaultRank: Rank = 'A'
): Card {
  let value: number;

  if (defaultRank === 'A') {
    value = 11;
  } else if (['J', 'Q', 'K'].includes(defaultRank)) {
    value = 10;
  } else {
    value = parseInt(defaultRank);
  }

  return {
    suit,
    rank: defaultRank,
    value,
    faceUp: true,
    special: type,
  };
}

/**
 * Create Wild cards for Gambler deck
 */
export function createWildCards(count: number = 2): Card[] {
  const cards: Card[] = [];
  const suits: Suit[] = ['hearts', 'diamonds'];

  for (let i = 0; i < count; i++) {
    cards.push(createSpecialCard('wild', suits[i % suits.length], 'A'));
  }

  return cards;
}

/**
 * Create Golden cards for Gambler deck
 */
export function createGoldenCards(count: number = 2): Card[] {
  const cards: Card[] = [];
  const suits: Suit[] = ['clubs', 'spades'];

  for (let i = 0; i < count; i++) {
    cards.push(createSpecialCard('golden', suits[i % suits.length], '10'));
  }

  return cards;
}

/**
 * Check if a card is a Wild card
 */
export function isWildCard(card: Card): boolean {
  return card.special === 'wild';
}

/**
 * Check if a card is a Golden card
 */
export function isGoldenCard(card: Card): boolean {
  return card.special === 'golden';
}

/**
 * Set the rank of a Wild card
 */
export function setWildCardRank(card: Card, rank: Rank): Card {
  if (!isWildCard(card)) {
    return card;
  }

  let value: number;
  if (rank === 'A') {
    value = 11;
  } else if (['J', 'Q', 'K'].includes(rank)) {
    value = 10;
  } else {
    value = parseInt(rank);
  }

  return {
    ...card,
    selectedRank: rank,
    rank,
    value,
  };
}

/**
 * Get the display name for a special card
 */
export function getSpecialCardName(card: Card): string {
  if (isWildCard(card)) {
    if (card.selectedRank) {
      return `Wild (${card.selectedRank})`;
    }
    return 'Wild Card';
  }

  if (isGoldenCard(card)) {
    return `Golden ${card.rank}`;
  }

  return `${card.rank}`;
}

/**
 * Get the bonus chips for a Golden card
 */
export function getGoldenCardBonus(): number {
  return 2;
}

/**
 * Check if any Golden cards were drawn in initial deal
 */
export function getGoldenCardsInHand(hand: Card[]): Card[] {
  return hand.filter(isGoldenCard);
}
