import type { Card } from './game';

// Starter Deck System Types

export type StarterDeckId =
  | 'grinder'
  | 'highRoller'
  | 'aceHunter'
  | 'gambler'
  | 'survivor';

export type DeckDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface ColorTheme {
  primary: string;
  secondary: string;
}

export interface SignaturePassive {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface StarterDeck {
  id: StarterDeckId;
  name: string;
  icon: string;
  colorTheme: ColorTheme;
  tagline: string;
  description: string;

  // Starting Resources
  startingChips: number;
  startingEdge: number;
  maxEdge: number;

  // Deck Configuration
  deckSize: number;
  removedCards: string[]; // Rank IDs removed (e.g., ['2', '3'])
  specialCards: SpecialCardConfig[];

  // Starting Equipment
  startingPowerId: string | null; // Power ID, or null
  signaturePassive: SignaturePassive;

  // Meta
  unlockRequirement: string | null; // null = unlocked from start
  dustUnlockCost: number; // Cost to unlock with Dust
  difficulty: DeckDifficulty;
  playstyleDescription: string;
}

export type SpecialCardType = 'wild' | 'shield' | 'golden' | 'curse';

export interface SpecialCardConfig {
  type: SpecialCardType;
  count: number; // How many of these cards
  baseCard?: string; // If based on existing card (e.g., '10' for golden 10)
}

export interface SpecialCardInstance extends Card {
  specialType: SpecialCardType;
  // Wild card
  chosenValue?: number; // 1-10
  // Golden card
  bonusChips?: number; // Chip bonus when drawn
  // Curse card
  cursed?: boolean; // Affects dealer
}

export interface DeckStats {
  deckId: StarterDeckId;
  runsStarted: number;
  runsWon: number;
  avgStageReached: number;
  totalChipsEarned: number;
  blackjacksHit: number;
  signaturePassiveTriggers: number;
  bestChipCount: number;
  fastestVictoryMs: number;
}

export interface DeckUnlockStatus {
  deckId: StarterDeckId;
  unlocked: boolean;
  unlockedVia?: 'achievement' | 'dust';
  unlockedAt?: number; // timestamp
}
