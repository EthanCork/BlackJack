import type { Suit } from '@/types/game';

/**
 * Special Card Pool - All Special Cards
 * Replaces the Relic system with powerful cards that provide passive bonuses
 */

export type SpecialCardRarity = 'common' | 'rare' | 'legendary';

export type EffectTrigger =
  | 'onDraw'
  | 'onPlay'
  | 'onWin'
  | 'onLose'
  | 'onBust'
  | 'onBlackjack'
  | 'onDouble'
  | 'onStand'
  | 'passive'
  | 'manual';

export interface SpecialCardDef {
  id: string;
  name: string;
  displayName: string;

  // Visuals
  icon: string;
  rarity: SpecialCardRarity;

  // Card Properties
  baseValue: number | 'choice' | 'copy' | 'random';
  valueRange?: { min: number; max: number }; // for 'choice' or 'random'

  // Pricing
  shopCost: number;
  unlockCost: number; // Dust to unlock (0 = starts unlocked)

  // Effect
  effectTrigger: EffectTrigger;
  effectDescription: string;

  // Meta
  synergyDecks: string[]; // Deck IDs this pairs well with
  startUnlocked: boolean; // Available from the start
}

/**
 * ============================================
 * COMMON SPECIAL CARDS (10-12 chips)
 * ============================================
 */

export const COMMON_SPECIAL_CARDS: Record<string, SpecialCardDef> = {
  lucky7: {
    id: 'lucky7',
    name: 'Lucky 7',
    displayName: 'Lucky 7',
    icon: '🍀',
    rarity: 'common',
    baseValue: 7,
    shopCost: 10,
    unlockCost: 0,
    effectTrigger: 'onDraw',
    effectDescription: 'Gain +3 chips when drawn',
    synergyDecks: ['grinder', 'highRoller'],
    startUnlocked: true,
  },

  chip5: {
    id: 'chip5',
    name: 'Chip 5',
    displayName: 'Chip 5',
    icon: '💰',
    rarity: 'common',
    baseValue: 5,
    shopCost: 10,
    unlockCost: 0,
    effectTrigger: 'onDraw',
    effectDescription: 'Gain +2 chips when drawn',
    synergyDecks: ['grinder'],
    startUnlocked: true,
  },

  safe4: {
    id: 'safe4',
    name: 'Safe 4',
    displayName: 'Safe 4',
    icon: '🛡️',
    rarity: 'common',
    baseValue: 4,
    shopCost: 10,
    unlockCost: 0,
    effectTrigger: 'passive',
    effectDescription: 'If this card would bust you, it counts as 0 instead',
    synergyDecks: ['highRoller', 'gambler'],
    startUnlocked: true,
  },

  mirrorCard: {
    id: 'mirrorCard',
    name: 'Mirror Card',
    displayName: 'Mirror Card',
    icon: '🪞',
    rarity: 'common',
    baseValue: 'copy',
    shopCost: 12,
    unlockCost: 0,
    effectTrigger: 'passive',
    effectDescription: 'Copies the value of the last card drawn',
    synergyDecks: ['gambler', 'survivor'],
    startUnlocked: true,
  },

  steady6: {
    id: 'steady6',
    name: 'Steady 6',
    displayName: 'Steady 6',
    icon: '⚡',
    rarity: 'common',
    baseValue: 6,
    shopCost: 10,
    unlockCost: 50,
    effectTrigger: 'onDraw',
    effectDescription: 'Gain +1 Edge when drawn',
    synergyDecks: ['survivor'],
    startUnlocked: false,
  },

  loaded3: {
    id: 'loaded3',
    name: 'Loaded 3',
    displayName: 'Loaded 3',
    icon: '💵',
    rarity: 'common',
    baseValue: 3,
    shopCost: 10,
    unlockCost: 60,
    effectTrigger: 'onWin',
    effectDescription: 'If you win the hand, gain +4 bonus chips',
    synergyDecks: ['grinder', 'highRoller'],
    startUnlocked: false,
  },

  anchor2: {
    id: 'anchor2',
    name: 'Anchor 2',
    displayName: 'Anchor 2',
    icon: '⚓',
    rarity: 'common',
    baseValue: 2,
    shopCost: 10,
    unlockCost: 50,
    effectTrigger: 'onDraw',
    effectDescription: 'Your hand cannot bust this turn after drawing this',
    synergyDecks: ['highRoller', 'gambler'],
    startUnlocked: false,
  },
};

/**
 * ============================================
 * RARE SPECIAL CARDS (15-18 chips)
 * ============================================
 */

export const RARE_SPECIAL_CARDS: Record<string, SpecialCardDef> = {
  wildCard: {
    id: 'wildCard',
    name: 'Wild Card',
    displayName: 'Wild Card',
    icon: '❓',
    rarity: 'rare',
    baseValue: 'choice',
    valueRange: { min: 1, max: 10 },
    shopCost: 15,
    unlockCost: 0,
    effectTrigger: 'manual',
    effectDescription: 'Choose any value 1-10 when drawn',
    synergyDecks: ['gambler', 'survivor'],
    startUnlocked: true,
  },

  golden10: {
    id: 'golden10',
    name: 'Golden 10',
    displayName: 'Golden 10',
    icon: '✨',
    rarity: 'rare',
    baseValue: 10,
    shopCost: 15,
    unlockCost: 0,
    effectTrigger: 'onDraw',
    effectDescription: 'Gain +5 chips when drawn',
    synergyDecks: ['highRoller', 'gambler'],
    startUnlocked: true,
  },

  shieldCard: {
    id: 'shieldCard',
    name: 'Shield Card',
    displayName: 'Shield Card',
    icon: '🛡️',
    rarity: 'rare',
    baseValue: 0,
    shopCost: 15,
    unlockCost: 0,
    effectTrigger: 'passive',
    effectDescription: 'Cannot contribute to bust, essentially a free card',
    synergyDecks: ['highRoller', 'survivor'],
    startUnlocked: true,
  },

  doubleCard: {
    id: 'doubleCard',
    name: 'Double Card',
    displayName: 'Double Card',
    icon: '💎',
    rarity: 'rare',
    baseValue: 8,
    shopCost: 16,
    unlockCost: 100,
    effectTrigger: 'onDouble',
    effectDescription: 'If you double down with this in hand, payout is 3:1 instead of 2:1',
    synergyDecks: ['gambler'],
    startUnlocked: false,
  },

  pressureKing: {
    id: 'pressureKing',
    name: 'Pressure King',
    displayName: 'Pressure K',
    icon: '👑',
    rarity: 'rare',
    baseValue: 10,
    shopCost: 15,
    unlockCost: 120,
    effectTrigger: 'onDraw',
    effectDescription: 'When drawn, dealer must hit one extra time this hand',
    synergyDecks: ['aceHunter'],
    startUnlocked: false,
  },

  insightJack: {
    id: 'insightJack',
    name: 'Insight Jack',
    displayName: 'Insight J',
    icon: '🔮',
    rarity: 'rare',
    baseValue: 10,
    shopCost: 15,
    unlockCost: 110,
    effectTrigger: 'onDraw',
    effectDescription: 'When drawn, see the top card of the deck',
    synergyDecks: ['survivor'],
    startUnlocked: false,
  },

  fortuneQueen: {
    id: 'fortuneQueen',
    name: 'Fortune Queen',
    displayName: 'Fortune Q',
    icon: '👸',
    rarity: 'rare',
    baseValue: 10,
    shopCost: 15,
    unlockCost: 110,
    effectTrigger: 'onDraw',
    effectDescription: 'When drawn, gain +3 chips. If you get blackjack, gain +10 instead',
    synergyDecks: ['aceHunter', 'highRoller'],
    startUnlocked: false,
  },

  recovery9: {
    id: 'recovery9',
    name: 'Recovery 9',
    displayName: 'Recovery 9',
    icon: '♻️',
    rarity: 'rare',
    baseValue: 9,
    shopCost: 14,
    unlockCost: 100,
    effectTrigger: 'onDraw',
    effectDescription: 'If you lost the previous hand, gain +8 chips when drawn',
    synergyDecks: ['survivor'],
    startUnlocked: false,
  },

  vampireAce: {
    id: 'vampireAce',
    name: 'Vampire Ace',
    displayName: 'Vampire A',
    icon: '🧛',
    rarity: 'rare',
    baseValue: 11,
    shopCost: 18,
    unlockCost: 150,
    effectTrigger: 'onWin',
    effectDescription: 'If you win, gain +3 bonus chips',
    synergyDecks: ['aceHunter', 'highRoller'],
    startUnlocked: false,
  },
};

/**
 * ============================================
 * LEGENDARY SPECIAL CARDS (20-25 chips)
 * ============================================
 */

export const LEGENDARY_SPECIAL_CARDS: Record<string, SpecialCardDef> = {
  perfect10: {
    id: 'perfect10',
    name: 'Perfect 10',
    displayName: 'Perfect 10',
    icon: '💯',
    rarity: 'legendary',
    baseValue: 10,
    shopCost: 20,
    unlockCost: 200,
    effectTrigger: 'passive',
    effectDescription: 'Cannot cause you to bust. If it would, counts as 0',
    synergyDecks: ['highRoller', 'gambler'],
    startUnlocked: false,
  },

  loadedAce: {
    id: 'loadedAce',
    name: 'Loaded Ace',
    displayName: 'Loaded A',
    icon: '🌟',
    rarity: 'legendary',
    baseValue: 11,
    shopCost: 22,
    unlockCost: 250,
    effectTrigger: 'onBlackjack',
    effectDescription: 'Blackjacks with this Ace pay 3:1 instead of 3:2',
    synergyDecks: ['aceHunter'],
    startUnlocked: false,
  },

  chaosCard: {
    id: 'chaosCard',
    name: 'Chaos Card',
    displayName: 'Chaos Card',
    icon: '🎲',
    rarity: 'legendary',
    baseValue: 'random',
    valueRange: { min: 1, max: 13 },
    shopCost: 20,
    unlockCost: 200,
    effectTrigger: 'onDraw',
    effectDescription: 'Random value 1-13 each time drawn. Also grants +2 chips',
    synergyDecks: ['gambler'],
    startUnlocked: false,
  },

  phoenixCard: {
    id: 'phoenixCard',
    name: 'Phoenix Card',
    displayName: 'Phoenix Card',
    icon: '🔥',
    rarity: 'legendary',
    baseValue: 5,
    shopCost: 25,
    unlockCost: 300,
    effectTrigger: 'passive',
    effectDescription: 'Once per run, if you would hit 0 chips, return to 25 chips instead',
    synergyDecks: ['survivor', 'gambler'],
    startUnlocked: false,
  },

  timeCard: {
    id: 'timeCard',
    name: 'Time Card',
    displayName: 'Time Card',
    icon: '⏰',
    rarity: 'legendary',
    baseValue: 7,
    shopCost: 22,
    unlockCost: 250,
    effectTrigger: 'manual',
    effectDescription: 'Once per stage, return this card to deck to undo your last action',
    synergyDecks: ['survivor'],
    startUnlocked: false,
  },

  echoCard: {
    id: 'echoCard',
    name: 'Echo Card',
    displayName: 'Echo Card',
    icon: '📡',
    rarity: 'legendary',
    baseValue: 'copy',
    shopCost: 20,
    unlockCost: 200,
    effectTrigger: 'passive',
    effectDescription: 'Copies your first card this hand. Start with a guaranteed pair',
    synergyDecks: ['gambler'],
    startUnlocked: false,
  },

  thiefCard: {
    id: 'thiefCard',
    name: 'Thief Card',
    displayName: 'Thief Card',
    icon: '🦹',
    rarity: 'legendary',
    baseValue: 4,
    shopCost: 22,
    unlockCost: 250,
    effectTrigger: 'onBust',
    effectDescription: 'If dealer busts, gain +10 bonus chips',
    synergyDecks: ['aceHunter'],
    startUnlocked: false,
  },

  crownCard: {
    id: 'crownCard',
    name: 'Crown Card',
    displayName: 'Crown Card',
    icon: '👑',
    rarity: 'legendary',
    baseValue: 10,
    shopCost: 25,
    unlockCost: 300,
    effectTrigger: 'onStand',
    effectDescription: 'Standing on exactly 21 grants +15 chips',
    synergyDecks: ['highRoller', 'aceHunter'],
    startUnlocked: false,
  },

  omegaCard: {
    id: 'omegaCard',
    name: 'Omega Card',
    displayName: 'Omega Card',
    icon: 'Ω',
    rarity: 'legendary',
    baseValue: 'choice',
    valueRange: { min: 1, max: 11 },
    shopCost: 25,
    unlockCost: 300,
    effectTrigger: 'manual',
    effectDescription: 'Choose ANY value 1-11 when drawn (even 11 like Ace high)',
    synergyDecks: ['gambler', 'survivor'],
    startUnlocked: false,
  },

  jackpotCard: {
    id: 'jackpotCard',
    name: 'Jackpot Card',
    displayName: 'Jackpot 7',
    icon: '🎰',
    rarity: 'legendary',
    baseValue: 7,
    shopCost: 20,
    unlockCost: 200,
    effectTrigger: 'passive',
    effectDescription: 'Three 7s in one hand = instant +50 chips (on top of win)',
    synergyDecks: ['gambler'],
    startUnlocked: false,
  },
};

/**
 * All special cards combined
 */
export const ALL_SPECIAL_CARDS = {
  ...COMMON_SPECIAL_CARDS,
  ...RARE_SPECIAL_CARDS,
  ...LEGENDARY_SPECIAL_CARDS,
};

/**
 * Get all unlocked special cards
 */
export function getUnlockedSpecialCards(unlockedIds: string[]): SpecialCardDef[] {
  return Object.values(ALL_SPECIAL_CARDS).filter(
    card => card.startUnlocked || unlockedIds.includes(card.id)
  );
}

/**
 * Get special cards by rarity
 */
export function getSpecialCardsByRarity(rarity: SpecialCardRarity): SpecialCardDef[] {
  return Object.values(ALL_SPECIAL_CARDS).filter(card => card.rarity === rarity);
}

/**
 * Get shop cost for a card type
 */
export function getCardShopCost(specialId?: string): number {
  if (!specialId) return 0; // Standard cards are priced elsewhere
  return ALL_SPECIAL_CARDS[specialId]?.shopCost || 0;
}
