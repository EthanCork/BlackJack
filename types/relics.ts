// Relic system types

export type RelicTier = 1 | 2 | 3 | 4;

export type RelicTrigger =
  | 'stageStart'      // At the beginning of each stage
  | 'onWin'           // After winning a hand
  | 'onLoss'          // After losing a hand
  | 'onPush'          // After a push
  | 'onBlackjack'     // When player gets blackjack
  | 'onDouble'        // When double down is used
  | 'onSplit'         // When split is used
  | 'onDealerBust'    // When dealer busts
  | 'onHandEnd'       // After every hand
  | 'onDeal'          // During card deal
  | 'onDraw'          // When drawing a card
  | 'manual'          // Player activated
  | 'passive';        // Always active (rule modifier)

export interface Relic {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: RelicTier;
  trigger: RelicTrigger;

  // Usage limits (null = unlimited)
  usesPerStage?: number;
  usesPerRun?: number;

  // Effect data (specific to each relic)
  effectData?: any;
}

export interface RelicEffect {
  relicId: string;
  stage: number;
  usesThisStage: number;
  usesThisRun: number;
  data?: any; // Relic-specific state
}
