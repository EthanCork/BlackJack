// Challenge system types

export type ChallengeCategory =
  | 'economy'      // Affects chip economy
  | 'rules'        // Changes game rules
  | 'cards'        // Affects card mechanics
  | 'powers'       // Affects power system
  | 'psychological'; // UI/UX challenges

export interface Challenge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: ChallengeCategory;
  removeCost: number; // Chips to remove this challenge

  // Effect data
  effectData?: any;
}

export interface ActiveChallenge {
  challengeId: string;
  stage: number;
  wasRemoved: boolean;
}
