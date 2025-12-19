import type { Card, Rank } from './game';

// Special card types for deck manipulation

export type SpecialCardType =
  | 'wildTen'      // Counts as any 10-value (player chooses)
  | 'goldenAce'    // Ace that pays 3:1 on blackjack
  | 'mirrorCard'   // Copies value of last card drawn
  | 'luckySeven'   // Grants +3 chips when drawn
  | 'perfectTen';  // Cannot cause bust (counts as 0 if would bust)

export interface SpecialCard extends Card {
  specialType: SpecialCardType;
  chosenValue?: number; // For wildTen (10, J, Q, K)
  bonusChips?: number;  // For luckySeven
}

export interface DeckModification {
  type: 'remove' | 'add' | 'transform';
  timestamp: number;
  cost: number;

  // For remove
  removedCard?: Card;

  // For add
  addedCard?: SpecialCard;

  // For transform
  originalCard?: Card;
  newRank?: Rank;
}

export interface DeckState {
  baseCards: Card[];           // Original 52-card deck
  removedCards: Card[];         // Cards removed from deck
  addedCards: SpecialCard[];    // Special cards added
  transformedCards: Map<string, Rank>; // cardId -> new rank

  // Current deck for drawing
  currentDeck: (Card | SpecialCard)[];
}
