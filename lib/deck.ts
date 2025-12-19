import type { Card, Suit, Rank } from '@/types/game';

const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

/**
 * Get the numeric value for a card rank
 * Number cards = face value, Face cards = 10, Ace = 11 (adjusted dynamically in hand calculation)
 */
function getCardValue(rank: Rank): number {
  if (rank === 'A') return 11;
  if (rank === 'J' || rank === 'Q' || rank === 'K') return 10;
  return parseInt(rank, 10);
}

/**
 * Creates a standard 52-card deck
 */
export function createDeck(): Card[] {
  const deck: Card[] = [];

  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({
        suit,
        rank,
        value: getCardValue(rank),
        faceUp: false,
      });
    }
  }

  return shuffle(deck);
}

/**
 * Fisher-Yates shuffle algorithm
 * Shuffles the deck in place and returns it
 */
export function shuffle(deck: Card[]): Card[] {
  const shuffled = [...deck];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

/**
 * Draws a card from the top of the deck
 * Mutates the deck array by removing the card
 */
export function drawCard(deck: Card[]): Card | undefined {
  return deck.pop();
}
