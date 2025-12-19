import type { Card } from './game';

// Power activation timing windows
export type PowerTiming =
  | 'preDeal'      // After betting, before cards dealt
  | 'playerTurn'   // During player's turn, before acting
  | 'preDealer'    // After player stands, before dealer reveals
  | 'onBust';      // When player would bust

// Power tiers for acquisition
export type PowerTier = 1 | 2 | 3 | 4;

// Power state during a hand
export type PowerState =
  | 'available'    // Can be used
  | 'insufficient' // Not enough Edge
  | 'wrongTiming'  // Not the right phase
  | 'used'         // Already used this hand
  | 'cooldown';    // On stage/run cooldown

// Power definition
export interface Power {
  id: string;
  name: string;
  description: string;
  cost: number;               // Edge cost to activate
  tier: PowerTier;            // 1-4, determines when it can be offered
  timing: PowerTiming;        // When it can be activated
  icon: string;               // Emoji or icon identifier
  usesPerHand?: number;       // Default 1, null = unlimited
  usesPerStage?: number;      // null = unlimited
  usesPerRun?: number;        // null = unlimited
  passive?: boolean;          // Activates automatically if conditions met
}

// Power effect handlers
export interface PowerEffects {
  // Tier 1
  peek: () => void;
  cardCount: () => number;
  insurancePlus: () => void;
  quickPeek: () => Card;

  // Tier 2
  swap: (cardIndex: number) => void;
  pressure: () => void;
  luckyDraw: () => [Card, Card];
  selectLuckyCard: (cardIndex: 0 | 1) => void;
  safetyNet: () => void;

  // Tier 3
  freeze: () => void;
  secondChance: () => void;
  stackedDeck: () => void;
  dealersTell: () => void;

  // Tier 4
  loadedDice: () => void;
  doubleAgent: () => void;
  timeWarp: () => void;
  perfectShuffle: () => void;
}

// Active power effect state
export interface ActivePowerEffect {
  powerId: string;
  data?: any; // Power-specific data (e.g., revealed cards, swap choices)
}

// Power usage tracking
export interface PowerUsage {
  powerId: string;
  timesUsed: number;
  edgeSpent: number;
  handsAffected: number;
}

// Power selection state (between stages)
export interface PowerSelection {
  isActive: boolean;
  options: Power[];
  onSelect: (powerId: string) => void;
}
