import type { Stage } from '@/types/game';

// Stage definitions for the roguelite progression
export const STAGES: Stage[] = [
  { number: 1, winsRequired: 3, name: 'The Lobby' },
  { number: 2, winsRequired: 3, name: 'Low Stakes' },
  { number: 3, winsRequired: 4, name: 'The Grind' },
  { number: 4, winsRequired: 4, name: 'Rising Heat' },
  { number: 5, winsRequired: 5, name: 'High Rollers' },
  { number: 6, winsRequired: 5, name: 'The Shark Tank' },
  { number: 7, winsRequired: 6, name: 'VIP Suite' },
  { number: 8, winsRequired: 6, name: 'The Vault' },
];

export const TOTAL_STAGES = STAGES.length;
export const FINAL_STAGE = STAGES.length;

/**
 * Get stage information by stage number
 */
export function getStage(stageNumber: number): Stage {
  const stage = STAGES[stageNumber - 1];
  if (!stage) {
    throw new Error(`Invalid stage number: ${stageNumber}`);
  }
  return stage;
}

/**
 * Check if a stage number is the final stage
 */
export function isFinalStage(stageNumber: number): boolean {
  return stageNumber === FINAL_STAGE;
}

/**
 * Get epitaph message based on stage reached
 */
export function getGameOverEpitaph(highestStage: number): string {
  if (highestStage === 1) {
    return "The house always wins... eventually.";
  } else if (highestStage <= 3) {
    return "Not a bad start. Try again?";
  } else if (highestStage <= 5) {
    return "A promising run cut short.";
  } else if (highestStage <= 7) {
    return "So close, yet so far...";
  } else {
    return "You almost had it!";
  }
}
