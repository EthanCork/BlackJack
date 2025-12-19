// Save data and persistence types for Phase 5

import type { MetaProgression } from './meta';
import type { AchievementProgress } from './achievements';
import type { DailyResult } from './daily';
import type { RunStats } from './game';

export interface LifetimeStats {
  // Runs
  totalRuns: number;
  victories: number;
  averageStage: number;

  // Hands
  totalHandsPlayed: number;
  totalHandsWon: number;
  totalBlackjacks: number;

  // Economy
  totalChipsWon: number;
  totalChipsLost: number;
  peakChipsInRun: number;

  // Actions
  totalDoubleDowns: number;
  totalSplits: number;
  totalPowersUsed: number;
  totalChallengesRemoved: number;

  // Time
  totalPlayTimeMs: number;
  longestRunMs: number;

  // Meta
  totalDustEarned: number;
  dailyChallengesCompleted: number;
}

export interface PersonalBests {
  highestChipsInRun: { value: number; runId: number };
  mostBlackjacksInRun: { value: number; runId: number };
  longestWinStreak: { value: number; runId: number };
  fastestVictoryMs: { value: number; runId: number };
  mostSpecialCards: { value: number; runId: number };
  mostPowersUsed: { value: number; runId: number };
  highestStageWithoutLoss: { value: number; runId: number };
  mostDustInRun: { value: number; runId: number };
}

export interface RunSummary {
  id: number;
  timestamp: number;
  durationMs: number;
  result: 'victory' | number; // 'victory' or stage number where run ended
  finalChips: number;
  stats: RunStats;
  dustEarned: number;
  achievementsUnlocked: string[];
}

export interface Settings {
  // Audio
  masterVolume: number; // 0-100
  musicVolume: number; // 0-100
  sfxVolume: number; // 0-100
  uiSoundsEnabled: boolean;

  // Visual
  screenShakeEnabled: boolean;
  reduceMotion: boolean;
  colorBlindMode: 'off' | 'deuteranopia' | 'protanopia' | 'tritanopia';
  highContrast: boolean;

  // Gameplay
  confirmPowerUse: boolean;
  confirmHighBets: boolean;
  autoStandOn21: boolean;
  fastDealer: boolean;
  showProbabilities: boolean;

  // Accessibility
  fontSize: 'small' | 'medium' | 'large' | 'extraLarge';
  tutorialTooltipsEnabled: boolean;
  screenReaderSupport: boolean;
  visualSoundCues: boolean;
  oneHandedMode: boolean;
}

export interface GameSave {
  // Meta
  version: string;
  lastSaved: number; // timestamp

  // Meta-progression
  metaProgression: MetaProgression;

  // Lifetime stats
  lifetimeStats: LifetimeStats;
  personalBests: PersonalBests;

  // Achievements
  achievementProgress: Record<string, AchievementProgress>;

  // Settings
  settings: Settings;

  // Current run (if any)
  activeRun: any | null; // RunState from game
  activeRunStartTime: number | null;

  // Daily
  lastDailyCompleted: string | null; // YYYY-MM-DD
  dailyResults: Record<string, DailyResult>; // date -> result

  // History
  runHistory: RunSummary[];
  runIdCounter: number;
}

export const DEFAULT_SETTINGS: Settings = {
  masterVolume: 80,
  musicVolume: 70,
  sfxVolume: 80,
  uiSoundsEnabled: true,

  screenShakeEnabled: true,
  reduceMotion: false,
  colorBlindMode: 'off',
  highContrast: false,

  confirmPowerUse: false,
  confirmHighBets: true,
  autoStandOn21: false,
  fastDealer: false,
  showProbabilities: true,

  fontSize: 'medium',
  tutorialTooltipsEnabled: true,
  screenReaderSupport: false,
  visualSoundCues: false,
  oneHandedMode: false,
};
