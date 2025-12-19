/**
 * SPECIAL CARD EFFECTS SYSTEM
 * Handles all special card triggers and effects during gameplay
 */

import type { Card } from '@/types/game';
import { ALL_SPECIAL_CARDS, type SpecialCardDef } from '@/data/specialCardPool';

export interface EffectContext {
  // Game state
  chips: number;
  playerHand: Card[];
  dealerHand: Card[];
  currentBet: number;
  deck: Card[];

  // Outcome info (for win/lose triggers)
  outcome?: 'win' | 'lose' | 'push' | 'blackjack' | null;
  isBlackjack?: boolean;
  isBust?: boolean;
}

export interface EffectResult {
  chipsChange?: number;
  message?: string;
  modifiedHand?: Card[];
  modifiedDeck?: Card[];
  skipDealerTurn?: boolean;
  forceOutcome?: 'win' | 'lose' | 'push';
}

/**
 * Get special card definition from a card
 */
export function getSpecialCardDef(card: Card): SpecialCardDef | null {
  if (!card.special) return null;
  return ALL_SPECIAL_CARDS[card.special] || null;
}

/**
 * Check if a card has a special effect
 */
export function hasSpecialEffect(card: Card): boolean {
  return !!card.special && !!ALL_SPECIAL_CARDS[card.special];
}

/**
 * Trigger all onDraw effects for cards in hand
 */
export function triggerOnDrawEffects(
  drawnCard: Card,
  context: EffectContext
): EffectResult {
  const def = getSpecialCardDef(drawnCard);
  if (!def || def.effectTrigger !== 'onDraw') {
    return {};
  }

  return executeSpecialEffect(def, drawnCard, context);
}

/**
 * Trigger all onWin effects
 */
export function triggerOnWinEffects(
  playerHand: Card[],
  context: EffectContext
): EffectResult {
  const results: EffectResult = {};
  let totalChipsChange = 0;
  const messages: string[] = [];

  for (const card of playerHand) {
    const def = getSpecialCardDef(card);
    if (def && def.effectTrigger === 'onWin') {
      const result = executeSpecialEffect(def, card, context);
      if (result.chipsChange) totalChipsChange += result.chipsChange;
      if (result.message) messages.push(result.message);
    }
  }

  if (totalChipsChange !== 0) results.chipsChange = totalChipsChange;
  if (messages.length > 0) results.message = messages.join(' | ');

  return results;
}

/**
 * Trigger all onLose effects
 */
export function triggerOnLoseEffects(
  playerHand: Card[],
  context: EffectContext
): EffectResult {
  const results: EffectResult = {};
  let totalChipsChange = 0;
  const messages: string[] = [];

  for (const card of playerHand) {
    const def = getSpecialCardDef(card);
    if (def && def.effectTrigger === 'onLose') {
      const result = executeSpecialEffect(def, card, context);
      if (result.chipsChange) totalChipsChange += result.chipsChange;
      if (result.message) messages.push(result.message);
    }
  }

  if (totalChipsChange !== 0) results.chipsChange = totalChipsChange;
  if (messages.length > 0) results.message = messages.join(' | ');

  return results;
}

/**
 * Trigger all onBlackjack effects
 */
export function triggerOnBlackjackEffects(
  playerHand: Card[],
  context: EffectContext
): EffectResult {
  const results: EffectResult = {};
  let totalChipsChange = 0;
  const messages: string[] = [];

  for (const card of playerHand) {
    const def = getSpecialCardDef(card);
    if (def && def.effectTrigger === 'onBlackjack') {
      const result = executeSpecialEffect(def, card, context);
      if (result.chipsChange) totalChipsChange += result.chipsChange;
      if (result.message) messages.push(result.message);
    }
  }

  if (totalChipsChange !== 0) results.chipsChange = totalChipsChange;
  if (messages.length > 0) results.message = messages.join(' | ');

  return results;
}

/**
 * Trigger all onBust effects
 */
export function triggerOnBustEffects(
  playerHand: Card[],
  context: EffectContext
): EffectResult {
  const results: EffectResult = {};
  let totalChipsChange = 0;
  const messages: string[] = [];

  for (const card of playerHand) {
    const def = getSpecialCardDef(card);
    if (def && def.effectTrigger === 'onBust') {
      const result = executeSpecialEffect(def, card, context);
      if (result.chipsChange) totalChipsChange += result.chipsChange;
      if (result.message) messages.push(result.message);
    }
  }

  if (totalChipsChange !== 0) results.chipsChange = totalChipsChange;
  if (messages.length > 0) results.message = messages.join(' | ');

  return results;
}

/**
 * Check for passive effects on cards in hand
 * Returns modified hand value if applicable
 */
export function checkPassiveEffects(
  playerHand: Card[],
  handValue: number
): { value: number; messages: string[] } {
  const messages: string[] = [];
  let value = handValue;

  for (const card of playerHand) {
    const def = getSpecialCardDef(card);
    if (!def || def.effectTrigger !== 'passive') continue;

    // Perfect 10: Cannot cause bust
    if (def.id === 'perfect10' && value > 21) {
      const originalValue = card.value;
      value = value - originalValue; // Remove Perfect 10 from total
      messages.push('Perfect 10 saved you from bust!');
    }

    // Shield Card: Reduce damage (passive protection)
    // (Handled in onLose trigger instead)

    // Anchor 2: Always counts as 2
    // (Already handled by baseValue, no additional logic needed)
  }

  return { value, messages };
}

/**
 * Execute a specific special card effect
 */
function executeSpecialEffect(
  def: SpecialCardDef,
  card: Card,
  context: EffectContext
): EffectResult {
  // Map special card IDs to their effect implementations
  switch (def.id) {
    // === COMMON CARDS ===
    case 'lucky7':
      return { chipsChange: 3, message: '🍀 Lucky 7: +3 chips' };

    case 'chip5':
      return { chipsChange: 2, message: '💰 Chip 5: +2 chips' };

    case 'safe4':
      // Safe 4: Cannot cause bust (handled in hand calculation)
      return {};

    case 'mirror':
      // Mirror Card: Copy value of previous card
      // (This requires special handling during draw - value already set)
      return {};

    case 'steady6':
      return { chipsChange: 1, message: '⚖️ Steady 6: +1 chip' };

    case 'loaded3':
      // Draw happens in gameStore
      return { message: '🎲 Loaded 3: Draw extra card' };

    case 'anchor2':
      // Always 2 (handled by baseValue)
      return {};

    // === RARE CARDS ===
    case 'wildCard':
      // Wild Card: Choose value 1-10 (handled by UI)
      return {};

    case 'golden10':
      return { chipsChange: 5, message: '✨ Golden 10: +5 chips' };

    case 'shield':
      // Shield Card: onLose - refund half bet
      if (def.effectTrigger === 'onLose') {
        const refund = Math.floor(context.currentBet / 2);
        return { chipsChange: refund, message: `🛡️ Shield: Refunded ${refund} chips` };
      }
      return {};

    case 'double':
      // Double Card: onWin - double chips won
      if (def.effectTrigger === 'onWin') {
        const bonus = context.currentBet; // Win already paid 1x, this adds another 1x
        return { chipsChange: bonus, message: `2️⃣ Double Card: Doubled payout (+${bonus})` };
      }
      return {};

    case 'pressureKing':
      // Pressure King: Dealer must hit on 17
      return { message: '👑 Pressure King: Dealer must hit on 17' };

    case 'insightJack':
      // Insight Jack: onDraw - reveal dealer hole card
      return { message: '🔍 Insight Jack: Dealer hole card revealed' };

    case 'fortuneQueen':
      // Fortune Queen: onWin - 50% chance for +10 chips
      if (def.effectTrigger === 'onWin' && Math.random() < 0.5) {
        return { chipsChange: 10, message: '👸 Fortune Queen: Bonus +10 chips!' };
      }
      return {};

    case 'recovery9':
      // Recovery 9: onLose - refund 25% of bet
      if (def.effectTrigger === 'onLose') {
        const refund = Math.floor(context.currentBet * 0.25);
        return { chipsChange: refund, message: `💚 Recovery 9: Recovered ${refund} chips` };
      }
      return {};

    case 'vampireAce':
      // Vampire Ace: onWin - gain life from dealer
      if (def.effectTrigger === 'onWin') {
        return { chipsChange: 8, message: '🧛 Vampire Ace: Drained +8 chips' };
      }
      return {};

    // === LEGENDARY CARDS ===
    case 'perfect10':
      // Perfect 10: Cannot cause bust (handled in checkPassiveEffects)
      return {};

    case 'loadedAce':
      // Loaded Ace: Always counts as 11, never 1
      return {};

    case 'chaos':
      // Chaos Card: Random value 1-11 each time
      return {};

    case 'phoenix':
      // Phoenix Card: onBust - negate bust once, then card burns
      if (def.effectTrigger === 'onBust' && context.isBust) {
        return {
          message: '🔥 Phoenix Card: Negated bust! Phoenix burns.',
          forceOutcome: 'push', // Convert bust to push
        };
      }
      return {};

    case 'time':
      // Time Card: Rewind to start of hand (one-time use)
      return { message: '⏰ Time Card activated! (Implementation pending)' };

    case 'echo':
      // Echo Card: Repeat last card drawn
      return { message: '🔊 Echo: Repeat last card (Implementation pending)' };

    case 'thief':
      // Thief Card: onWin - steal extra 5 chips
      if (def.effectTrigger === 'onWin') {
        return { chipsChange: 5, message: '🦹 Thief: Stole +5 chips' };
      }
      return {};

    case 'crown':
      // Crown Card: All face cards become 11
      return { message: '👑 Crown: Face cards = 11 (Implementation pending)' };

    case 'omega':
      // Omega Card: Choose any value 1-21
      return { message: '🌟 Omega: Choose any value 1-21' };

    case 'jackpot':
      // Jackpot Card: onBlackjack - triple payout
      if (def.effectTrigger === 'onBlackjack') {
        const bonus = context.currentBet * 2; // BJ normally pays 2.5x, this adds 2x more
        return { chipsChange: bonus, message: `💎 JACKPOT! Tripled payout (+${bonus})` };
      }
      return {};

    default:
      return {};
  }
}

/**
 * Get all special cards with passive effects in hand
 */
export function getPassiveSpecialCards(hand: Card[]): SpecialCardDef[] {
  return hand
    .map(card => getSpecialCardDef(card))
    .filter((def): def is SpecialCardDef => !!def && def.effectTrigger === 'passive');
}

/**
 * Check if hand contains a specific special card
 */
export function hasSpecialCard(hand: Card[], specialId: string): boolean {
  return hand.some(card => card.special === specialId);
}
