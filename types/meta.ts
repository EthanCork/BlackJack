// Meta-progression types for Phase 5

export interface DustEarning {
  source: DustSource;
  amount: number;
  description: string;
}

export type DustSource =
  | 'handPlayed'
  | 'handWon'
  | 'blackjack'
  | 'stageCleared'
  | 'bossDefeated'
  | 'runVictory'
  | 'stageBased'
  | 'achievement';

export interface UnlockItem {
  id: string;
  type: 'power' | 'relic' | 'bonus' | 'cosmetic';
  cost: number;
  unlocked: boolean;
}

export type StartingBonus =
  | 'chipBoost1'
  | 'chipBoost2'
  | 'chipBoost3'
  | 'edgeBoost1'
  | 'edgeBoost2'
  | 'maxEdgeBoost'
  | 'headStart'
  | 'powerPrimer'
  | 'slimDeck'
  | 'luckyStart'
  | 'bossBounty'
  | 'veteransIntuition';

export interface StartingBonusDefinition {
  id: StartingBonus;
  name: string;
  description: string;
  cost: number;
  category: 'chips' | 'edge' | 'content' | 'luck' | 'meta';
  exclusive?: StartingBonus[]; // Can't own these at same time
}

export type CosmeticType = 'cardBack' | 'tableFelt' | 'chipSet';

export interface CosmeticItem {
  id: string;
  type: CosmeticType;
  name: string;
  description: string;
  cost: number;
  preview?: string;
}

export interface MetaProgression {
  totalDust: number;
  lifetimeDustEarned: number;

  // Unlocks
  unlockedPowers: string[];
  unlockedRelics: string[];
  purchasedBonuses: StartingBonus[];
  ownedCosmetics: string[];

  // Active cosmetics
  activeCardBack: string;
  activeTableFelt: string;
  activeChipSet: string;
}

export interface DustShopCategory {
  id: string;
  name: string;
  icon: string;
  items: UnlockItem[] | StartingBonusDefinition[] | CosmeticItem[];
}
