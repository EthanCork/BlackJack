import type { Card, HandValue } from '@/types/game';
import { BLACKJACK_VALUE } from './constants';
import { checkPassiveEffects, hasSpecialCard } from './specialCardEffects';

/**
 * Calculate the value of a blackjack hand
 * Handles Ace logic: Aces count as 11, but will count as 1 if hand would bust
 * Multiple Aces are handled correctly (e.g., A-A-9 = 12, not 31 or bust)
 * Also handles special card passive effects
 *
 * @returns HandValue with total value and whether it's a "soft" hand (contains an Ace counted as 11)
 */
export function calculateHandValue(cards: Card[]): HandValue {
  let value = 0;
  let aces = 0;

  // First pass: sum all values and count aces
  for (const card of cards) {
    value += card.value;
    if (card.rank === 'A') {
      aces += 1;
    }
  }

  // Adjust for aces: if we're over 21 and have aces, convert them from 11 to 1
  // Each conversion reduces the total by 10 (11 -> 1)
  while (value > BLACKJACK_VALUE && aces > 0) {
    value -= 10;
    aces -= 1;
  }

  // Check for special card passive effects (Perfect 10, Safe 4, etc.)
  // Perfect 10: Doesn't count if it would cause bust
  if (value > BLACKJACK_VALUE && hasSpecialCard(cards, 'perfect10')) {
    const perfect10Card = cards.find(c => c.special === 'perfect10');
    if (perfect10Card) {
      value -= perfect10Card.value; // Remove Perfect 10 from total
    }
  }

  // Safe 4: Cannot cause bust
  if (value > BLACKJACK_VALUE && hasSpecialCard(cards, 'safe4')) {
    const safe4Card = cards.find(c => c.special === 'safe4');
    if (safe4Card) {
      value -= safe4Card.value; // Remove Safe 4 from total
    }
  }

  // Soft hand = we have at least one ace still counted as 11
  const soft = aces > 0 && value <= BLACKJACK_VALUE;

  return { value, soft };
}

/**
 * Check if a hand is a natural blackjack (exactly 2 cards totaling 21)
 */
export function isBlackjack(cards: Card[]): boolean {
  if (cards.length !== 2) return false;
  const { value } = calculateHandValue(cards);
  return value === BLACKJACK_VALUE;
}

/**
 * Check if a hand is bust (over 21)
 */
export function isBust(cards: Card[]): boolean {
  const { value } = calculateHandValue(cards);
  return value > BLACKJACK_VALUE;
}

/**
 * Get only the face-up cards from a hand (for dealer display before revealing)
 */
export function getFaceUpCards(cards: Card[]): Card[] {
  return cards.filter(card => card.faceUp);
}
