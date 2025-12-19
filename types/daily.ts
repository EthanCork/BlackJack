// Daily Challenge types for Phase 5

export type DailyModifierType = 'positive' | 'negative' | 'neutral';

export interface DailyModifier {
  id: string;
  name: string;
  description: string;
  type: DailyModifierType;
  icon: string;
}

export interface DailyChallenge {
  date: string; // YYYY-MM-DD
  seed: number;
  name: string;
  modifiers: DailyModifier[];
  completionReward: number; // Dust
}

export interface DailyResult {
  date: string;
  completed: boolean;
  stageReached: number;
  finalChips: number;
  handsPlayed: number;
  timestamp: number;
}

export interface LeaderboardEntry {
  rank: number;
  playerName: string;
  stageReached: number;
  finalChips: number;
  handsPlayed: number;
  isCurrentPlayer?: boolean;
}

export interface DailyLeaderboard {
  date: string;
  entries: LeaderboardEntry[];
  totalParticipants: number;
  playerRank?: number;
}
