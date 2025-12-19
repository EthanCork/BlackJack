import type { DustEarning, DustSource } from '@/types/meta';
import type { RunStats } from '@/types/game';

/**
 * Calculate Dust earned from various sources
 */

export function calculateHandPlayedDust(): DustEarning {
  return {
    source: 'handPlayed',
    amount: 1,
    description: 'Hand played',
  };
}

export function calculateHandWonDust(): DustEarning {
  return {
    source: 'handWon',
    amount: 1,
    description: 'Hand won',
  };
}

export function calculateBlackjackDust(): DustEarning {
  return {
    source: 'blackjack',
    amount: 2,
    description: 'Blackjack',
  };
}

export function calculateStageClearedDust(): DustEarning {
  return {
    source: 'stageCleared',
    amount: 5,
    description: 'Stage cleared',
  };
}

export function calculateBossDefeatedDust(): DustEarning {
  return {
    source: 'bossDefeated',
    amount: 15,
    description: 'Boss defeated',
  };
}

export function calculateRunVictoryDust(): DustEarning {
  return {
    source: 'runVictory',
    amount: 50,
    description: 'Victory!',
  };
}

export function calculateStageBasedDust(stageReached: number): DustEarning {
  const amount = stageReached * 5;
  return {
    source: 'stageBased',
    amount,
    description: `Reached Stage ${stageReached}`,
  };
}

/**
 * Calculate total Dust earned from a completed run
 */
export function calculateRunDustEarnings(
  stats: RunStats,
  finalStage: number,
  victory: boolean
): { total: number; breakdown: DustEarning[] } {
  const earnings: DustEarning[] = [];

  // Hands played
  if (stats.handsPlayed > 0) {
    earnings.push({
      source: 'handPlayed',
      amount: stats.handsPlayed,
      description: `Hands played: ${stats.handsPlayed}`,
    });
  }

  // Hands won
  if (stats.handsWon > 0) {
    earnings.push({
      source: 'handWon',
      amount: stats.handsWon,
      description: `Hands won: ${stats.handsWon}`,
    });
  }

  // Blackjacks
  if (stats.blackjacksHit > 0) {
    earnings.push({
      source: 'blackjack',
      amount: stats.blackjacksHit * 2,
      description: `Blackjacks: ${stats.blackjacksHit}`,
    });
  }

  // Stages cleared
  if (stats.stagesCleared > 0) {
    earnings.push({
      source: 'stageCleared',
      amount: stats.stagesCleared * 5,
      description: `Stages cleared: ${stats.stagesCleared}`,
    });
  }

  // Bosses defeated
  if (stats.bossesDefeated > 0) {
    earnings.push({
      source: 'bossDefeated',
      amount: stats.bossesDefeated * 15,
      description: `Bosses defeated: ${stats.bossesDefeated}`,
    });
  }

  // Victory bonus
  if (victory) {
    earnings.push(calculateRunVictoryDust());
  }

  // Stage-based bonus for losses
  if (!victory && finalStage > 0) {
    earnings.push(calculateStageBasedDust(finalStage));
  }

  const total = earnings.reduce((sum, earning) => sum + earning.amount, 0);

  return { total, breakdown: earnings };
}

/**
 * Format Dust amount for display
 */
export function formatDust(amount: number): string {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)}K`;
  }
  return amount.toString();
}

/**
 * Check if player can afford an unlock
 */
export function canAfford(currentDust: number, cost: number): boolean {
  return currentDust >= cost;
}
