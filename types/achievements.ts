// Achievement system types for Phase 5

export type AchievementCategory =
  | 'progression'
  | 'economy'
  | 'blackjack'
  | 'powers'
  | 'specialCards'
  | 'challenges'
  | 'deck'
  | 'misc';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  dustReward: number;
  icon: string;

  // Progress tracking
  requirement: number; // Target value
  hidden?: boolean; // Secret achievement
}

export interface AchievementProgress {
  id: string;
  unlocked: boolean;
  unlockedAt?: number; // timestamp
  currentProgress: number;
}

export interface AchievementUnlock {
  achievement: Achievement;
  timestamp: number;
}

export type AchievementTrigger =
  | 'runComplete'
  | 'stageReached'
  | 'handWon'
  | 'blackjackHit'
  | 'chipsReached'
  | 'powerUsed'
  | 'specialCardCollected'
  | 'bossDefeated'
  | 'challengeRemoved'
  | 'cardRemoved';
