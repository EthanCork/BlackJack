// Boss dealer system types
import type { Card } from './game';

export interface BossDealer {
  id: string;
  name: string;
  stage: number; // Which stage this boss appears on
  title: string; // Boss title/subtitle
  portrait: string; // Emoji or image path
  introQuote: string; // Quote shown before fight
  defeatQuote: string; // Quote shown after defeat
  specialRule: string; // Description of the rule

  // Boss deck (premade, fixed composition)
  deck: Card[]; // Exact cards in boss's deck
  deckSize: number;

  // Boss behavior modifiers
  dealerStandValue?: number; // Override dealer stand value (default 17)
  dealerHitsOnSoft17?: boolean; // True = hit soft 17, false/undefined = stand
  playerPushesAreLosses?: boolean; // Ties count as losses
  holeCardVisible?: boolean; // Hole card face up
  extraChipLossOnLoss?: number; // Extra chips lost per loss
  tiesAt17AreLosses?: boolean; // Specific to Pit Boss
  startingChipPenalty?: number; // Chips lost at fight start

  // Win requirements
  winsNeeded: number; // How many wins to defeat boss

  // Rewards for defeating boss
  chipReward: number;
  rareCardRewardCount?: number; // Number of rare cards to choose from
  bonusReward?: 'maxEdgeBoost' | 'victory';
}

export interface BossState {
  currentBoss: BossDealer | null;
  bossActive: boolean;
  bossDefeated: boolean;
}
