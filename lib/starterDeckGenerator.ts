import type { Card, Rank, Suit } from '@/types/game';
import type { StarterDeckId } from '@/types/starterDecks';
import { shuffle } from './deck';
import { createWildCards, createGoldenCards } from './specialCards';

/**
 * Generate the starting deck for a chosen starter deck archetype
 * Each deck has a specific composition of 12-16 cards
 */
export function generateStarterDeck(deckId: StarterDeckId): Card[] {
  const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
  const cards: Card[] = [];

  switch (deckId) {
    case 'grinder':
      // The Grinder: 14 cards - 2x (2,3,4,5,6,7,A)
      const grinderRanks: Rank[] = ['2', '3', '4', '5', '6', '7', 'A'];
      grinderRanks.forEach((rank, idx) => {
        // Add 2 copies of each rank, alternating suits for variety
        cards.push(createCard(rank, suits[idx % 4]));
        cards.push(createCard(rank, suits[(idx + 2) % 4]));
      });
      break;

    case 'highRoller':
      // The High Roller: 12 cards - 2x (9,10,J,Q,K,A)
      const highRollerRanks: Rank[] = ['9', '10', 'J', 'Q', 'K', 'A'];
      highRollerRanks.forEach((rank, idx) => {
        // Add 2 copies of each rank, alternating suits for variety
        cards.push(createCard(rank, suits[idx % 4]));
        cards.push(createCard(rank, suits[(idx + 2) % 4]));
      });
      break;

    case 'aceHunter':
      // The Ace Master: 12 cards - 4 Aces, 2x (5,6,10,K)
      // 4 Aces (one of each suit)
      suits.forEach(suit => {
        cards.push(createCard('A', suit));
      });
      // 2 copies each of 5, 6, 10, K
      const aceHunterRanks: Rank[] = ['5', '6', '10', 'K'];
      aceHunterRanks.forEach((rank, idx) => {
        // Alternate suits for variety
        cards.push(createCard(rank, suits[idx % 4]));
        cards.push(createCard(rank, suits[(idx + 2) % 4]));
      });
      break;

    case 'gambler':
      // The Gambler: 14 cards - standard mix + 2 Wild + 2 Golden
      // Standard cards: 2,7,7,8,8,10,10,J,A,A (10 cards) - use variety of suits
      cards.push(createCard('2', suits[0]));
      cards.push(createCard('7', suits[1]));
      cards.push(createCard('7', suits[2]));
      cards.push(createCard('8', suits[3]));
      cards.push(createCard('8', suits[0]));
      cards.push(createCard('10', suits[1]));
      cards.push(createCard('10', suits[2]));
      cards.push(createCard('J', suits[3]));
      cards.push(createCard('A', suits[0]));
      cards.push(createCard('A', suits[2]));

      // Special cards: 2 Wild + 2 Golden (4 cards)
      cards.push(...createWildCards(2));
      cards.push(...createGoldenCards(2));
      break;

    case 'survivor': // This is "The Foundation" in the revised design
      // The Foundation: 16 cards - balanced mix
      // 2x (3,5,6,7,9,10,Q,A)
      const foundationRanks: Rank[] = ['3', '5', '6', '7', '9', '10', 'Q', 'A'];
      foundationRanks.forEach((rank, idx) => {
        // Alternate suits for variety
        cards.push(createCard(rank, suits[idx % 4]));
        cards.push(createCard(rank, suits[(idx + 2) % 4]));
      });
      break;

    default:
      // Fallback to Foundation if unknown deck
      const defaultRanks: Rank[] = ['3', '5', '6', '7', '9', '10', 'Q', 'A'];
      defaultRanks.forEach((rank, idx) => {
        // Alternate suits for variety
        cards.push(createCard(rank, suits[idx % 4]));
        cards.push(createCard(rank, suits[(idx + 2) % 4]));
      });
  }

  // Shuffle the deck
  return shuffle(cards);
}

/**
 * Create a card with proper face-up state and value
 */
function createCard(rank: Rank, suit: Suit): Card {
  let value: number;

  if (rank === 'A') {
    value = 11; // Aces start as 11, adjusted dynamically
  } else if (['J', 'Q', 'K'].includes(rank)) {
    value = 10;
  } else {
    value = parseInt(rank);
  }

  return {
    suit,
    rank,
    value,
    faceUp: false,
  };
}

/**
 * Get deck statistics for display
 */
export function getDeckStatistics(deckId: StarterDeckId): {
  avgValue: number;
  tens: number;
  aces: number;
  lowCards: number;
} {
  const stats: Record<StarterDeckId, { avgValue: number; tens: number; aces: number; lowCards: number }> = {
    grinder: { avgValue: 4.4, tens: 0, aces: 2, lowCards: 12 },
    highRoller: { avgValue: 9.5, tens: 8, aces: 2, lowCards: 0 },
    aceHunter: { avgValue: 7.0, tens: 4, aces: 4, lowCards: 4 },
    gambler: { avgValue: 7.5, tens: 3, aces: 2, lowCards: 3 },
    survivor: { avgValue: 7.0, tens: 4, aces: 2, lowCards: 6 },
  };

  return stats[deckId];
}

/**
 * Check if deck needs special cards (Wild, Golden, etc.)
 */
export function needsSpecialCards(deckId: StarterDeckId): boolean {
  return deckId === 'gambler';
}

/**
 * Get the number of special cards for a deck
 */
export function getSpecialCardCount(deckId: StarterDeckId): { wild: number; golden: number } {
  if (deckId === 'gambler') {
    return { wild: 2, golden: 2 };
  }
  return { wild: 0, golden: 0 };
}
