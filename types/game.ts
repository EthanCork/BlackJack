export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

// Phase 5: Special card types for deck building
// Now using string IDs from specialCardPool instead of fixed union
export type SpecialCardType = string;

export interface Card {
  suit: Suit;
  rank: Rank;
  value: number; // 2-10 face value, J/Q/K = 10, A = 11 (adjusted dynamically)
  faceUp: boolean;
  special?: SpecialCardType; // Phase 5: Special card ID (from specialCardPool)
  selectedRank?: Rank; // Phase 5: For Wild/Omega cards, the rank chosen by player
}

export type GamePhase =
  | 'betting'      // Player choosing bet amount
  | 'dealing'      // Cards being dealt (animation)
  | 'playerTurn'   // Player can Hit/Stand/Double/Split
  | 'dealerTurn'   // Dealer reveals and plays
  | 'resolution'   // Winner determined, payout calculated
  | 'gameOver';    // Out of chips

export type Screen =
  | 'title'
  | 'lobby'             // Phase 5: Starter Deck Selection
  | 'game'
  | 'stageComplete'
  | 'gameOver'
  | 'victory'
  | 'powerSelection'
  | 'cardReward'        // Phase 5: Card Reward Selection
  | 'deckShop'          // Phase 4: Unified card shop (standard + special)
  | 'challengeScreen'   // Phase 4
  | 'bossIntro';        // Phase 4

export type Outcome = 'win' | 'lose' | 'push' | 'blackjack' | null;

export interface HandValue {
  value: number;
  soft: boolean; // Contains an Ace counted as 11
}

// Phase 2: Stage System
export interface Stage {
  number: number;
  winsRequired: number;
  name: string;
}

// Phase 2: Split State
export interface SplitState {
  isActive: boolean;
  activeHandIndex: 0 | 1; // Which hand is currently being played
  hands: [Card[], Card[]]; // Two separate hands
  bets: [number, number]; // Bet for each hand
  outcomes: [Outcome, Outcome]; // Result for each hand
  isSplitAces: boolean; // Special rule: Aces get only one card each
}

// Phase 2: Hand Result (for stats tracking)
export interface HandResult {
  stage: number;
  bet: number;
  playerValue: number;
  dealerValue: number;
  outcome: Outcome;
  chipChange: number;
  hadSplit: boolean;
  hadDouble: boolean;
}

// Phase 2: Run Statistics
export interface RunStats {
  // Core
  handsPlayed: number;
  handsWon: number;
  handsLost: number;
  handsPushed: number;

  // Blackjack specific
  blackjacksHit: number;
  doublesWon: number;
  doublesLost: number;
  splitsPlayed: number;

  // Economy
  totalChipsWon: number;
  totalChipsLost: number;
  peakChips: number;

  // Streaks
  currentWinStreak: number;
  bestWinStreak: number;
  currentLoseStreak: number;
  worstLoseStreak: number;

  // Progress
  highestStageReached: number;
  stagesCleared: number;

  // Phase 3: Power Stats
  totalEdgeSpent: number;
  totalPowersUsed: number;
  powerUsageCount: Record<string, number>; // powerId -> count
  clutchSaves: number; // Times Safety Net or Insurance+ saved a hand

  // Phase 4: Deck Stats
  specialCardsCollected: number;
  specialCardNames: string[];
  cardsRemoved: number;
  cardsAdded: number;
  cardsTransformed: number;

  // Phase 4: Challenge Stats
  challengesFaced: number;
  challengesRemoved: number;
  challengesSurvived: number;

  // Phase 4: Boss Stats
  bossesDefeated: number;

  // Phase 4: Economy Stats
  chipsSpentOnDeck: number;
  chipsSpentOnChallenges: number;
}
