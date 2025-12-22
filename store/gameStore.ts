import { create } from 'zustand';
import type { Card, GamePhase, Outcome, HandValue, Screen, SplitState, RunStats, HandResult } from '@/types/game';
import type { Power } from '@/types/powers';
import type { Challenge } from '@/types/challenges';
import type { BossDealer } from '@/types/bosses';
import type { SpecialCard } from '@/types/specialCards';
import { createDeck, drawCard, shuffle } from '@/lib/deck';
import { calculateHandValue, isBlackjack, isBust } from '@/lib/blackjack';
import {
  STARTING_CHIPS,
  BLACKJACK_PAYOUT,
  DEALER_STAND_VALUE,
  DEALER_CARD_DELAY,
  BLACKJACK_VALUE,
  STARTING_EDGE,
  MAX_EDGE,
  EDGE_PER_HAND,
  EDGE_STAGE_BONUS,
  MAX_EQUIPPED_POWERS,
} from '@/lib/constants';
import { getStage, isFinalStage } from '@/lib/stages';
import { createInitialStats, updateStatsWithHandResult } from '@/lib/stats';
import { POWER_POOL, getRandomPowers, getAllowedTiersForStage } from '@/data/powerPool';
import { CHALLENGE_POOL, getRandomChallenges, getChallengesForStage } from '@/data/challengePool';
import { getBossForStage, isBossStage } from '@/data/bossPool';
import { getStarterDeck } from '@/data/starterDeckPool';
import type { StarterDeckId, DeckUnlockStatus } from '@/types/starterDecks';
import { generateStarterDeck } from '@/lib/starterDeckGenerator';
import { getGoldenCardsInHand, getGoldenCardBonus } from '@/lib/specialCards';
import { generateCardRewards } from '@/lib/cardRewardGenerator';
import { ALL_SPECIAL_CARDS } from '@/data/specialCardPool';
import {
  triggerOnDrawEffects,
  triggerOnWinEffects,
  triggerOnLoseEffects,
  triggerOnBlackjackEffects,
  triggerOnBustEffects,
  hasSpecialCard,
} from '@/lib/specialCardEffects';
import {
  loadDeckUnlocks,
  saveDeckUnlocks,
  unlockDeck,
  checkAutoUnlocks,
  DECK_UNLOCK_COSTS,
} from '@/lib/deckUnlocks';
import {
  loadAllDeckStats,
  updateDeckStats,
  type DeckStats,
} from '@/lib/deckStats';
import {
  shouldTriggerSlowBurn,
  shouldTriggerPowerStance,
  calculateSlowBurnBonus,
  calculatePowerStanceBonus,
  getBlackjackPayout,
  getDoubleDownPayout,
  formatTraitMessage,
} from '@/lib/deckTraits';

/**
 * Calculate Dust reward based on run performance
 */
function calculateDustReward(stage: number, isVictory: boolean, runStats: RunStats): number {
  let dust = 0;

  // Base dust per stage reached
  dust += stage * 10;

  // Victory bonus
  if (isVictory) {
    dust += 100;
  }

  // Performance bonuses
  dust += runStats.handsWon * 2;
  dust += runStats.blackjacksHit * 5;
  dust += Math.floor(runStats.bestWinStreak / 3) * 10;

  return dust;
}

interface GameStore {
  // Deck & Cards
  deck: Card[]; // Player's deck
  dealerDeck: Card[]; // Dealer's deck (used during boss fights)
  playerHand: Card[];
  dealerHand: Card[];

  // Economy
  chips: number;
  currentBet: number;
  lastBet: number;

  // Game State
  phase: GamePhase;
  outcome: Outcome;
  message: string;
  isDoubleDown: boolean; // Track if current hand is a double down

  // Phase 2: Stage System
  currentStage: number;
  stageWins: number;

  // Phase 2: Split State
  splitState: SplitState | null;

  // Phase 2: Run Stats
  runStats: RunStats;

  // Phase 2: UI State
  screen: Screen;

  // Phase 5: Starter Deck
  activeDeckId: StarterDeckId | null;

  // Phase 5: Meta-Progression
  dust: number;
  totalDust: number;
  deckUnlocks: Record<string, import('@/types/starterDecks').DeckUnlockStatus>;
  deckStats: Record<string, DeckStats>;
  runStartTime: number; // Track run duration
  traitTriggersThisRun: number; // Track trait usage
  metaStats: {
    totalVictories: number;
    totalRuns: number;
    highestStageReached: number;
    mostBlackjacksInRun: number;
  };

  // Phase 3: Edge System
  edge: number;
  maxEdge: number;

  // Phase 3: Powers
  collectedPowers: Power[];
  equippedPowers: string[]; // Array of power IDs
  powerUsesThisHand: Record<string, number>;
  powerUsesThisStage: Record<string, number>;
  powerUsesThisRun: Record<string, number>;

  // Phase 3: Power Effects State
  peekActive: boolean;
  dealersTellActive: boolean;
  luckyDrawOptions: [Card, Card] | null;
  swapTargetOptions: Card[] | null;
  swapSelectMode: boolean;
  quickPeekCard: Card | null;
  cardCountResult: number | null;
  frozenDealer: boolean;
  pressuredDealer: boolean;

  // Phase 3: Power Selection State
  powerSelection: {
    isActive: boolean;
    options: Power[];
  };

  // Phase 5: Card Reward System
  cardRewardOptions: { card: Card; description: string }[] | null;

  // Phase 5: Special Card Unlocks
  unlockedSpecialCards: string[]; // IDs of unlocked special cards

  // Phase 4: Deck Manipulation
  removedCards: Card[];
  addedCards: SpecialCard[];
  transformedCards: Record<string, string>; // cardId -> new rank

  // Phase 4: Challenges
  activeChallenges: Challenge[];
  challengeHistory: { stage: number; faced: string[]; removed: string[] }[];
  blindHandsRemaining: number; // For Cold Deck challenge
  blockedPowerId: string | null; // For Power Block challenge

  // Phase 4: Boss
  currentBoss: BossDealer | null;
  bossActive: boolean;

  // Computed getters
  playerValue: () => HandValue;
  dealerValue: () => HandValue;
  canDoubleDown: () => boolean;
  canSplit: () => boolean;
  winsNeededForStage: () => number;
  isStageComplete: () => boolean;

  // Phase 1 Actions
  placeBet: (amount: number) => void;
  deal: () => void;
  hit: () => void;
  stand: () => void;
  dealerPlay: () => Promise<void>;
  resolveHand: () => void;
  resetHand: () => void;
  resetGame: () => void;

  // Phase 2 Actions
  doubleDown: () => void;
  split: () => void;
  playNextSplitHand: () => void;
  advanceStage: () => void;
  startNewRun: () => void;
  startRunWithDeck: (deckId: import('@/types/starterDecks').StarterDeckId) => void; // Phase 5
  recordHandResult: (result: HandResult) => void;
  setScreen: (screen: Screen) => void;

  // Phase 3: Edge Actions
  spendEdge: (amount: number) => boolean;
  regenerateEdge: (amount: number) => void;

  // Phase 3: Power Management
  selectPower: (powerId: string) => void;
  equipPower: (powerId: string) => void;
  unequipPower: (powerId: string) => void;
  offerPowerSelection: () => void;

  // Phase 3: Power Usage
  canUsePower: (powerId: string) => boolean;
  usePower: (powerId: string) => void;
  recordPowerUse: (powerId: string, edgeCost: number) => void;

  // Phase 3: Individual Power Effects
  executePeek: () => void;
  executeCardCount: () => void;
  executeInsurancePlus: () => void;
  executeQuickPeek: () => void;
  executeSwap: (cardIndex: number) => void;
  executePressure: () => void;
  executeLuckyDraw: () => void;
  selectLuckyCard: (index: 0 | 1) => void;
  executeSafetyNet: () => void;
  executeFreeze: () => void;
  executeSecondChance: () => void;
  executeStackedDeck: () => void;
  executeDealersTell: () => void;
  executeLoadedDice: () => void;
  executeDoubleAgent: () => void;
  executeTimeWarp: () => void;
  executePerfectShuffle: () => void;

  // Phase 5: Card Reward System
  offerCardReward: () => void;
  selectCardReward: (optionIndex: number) => void;
  skipCardReward: () => void;

  // Phase 5: Special Card Unlocks
  unlockSpecialCard: (cardId: string) => boolean;
  isSpecialCardUnlocked: (cardId: string) => boolean;

  // Phase 5: Meta-Progression & Unlocks
  loadMetaProgress: () => void;
  saveMetaProgress: () => void;
  unlockDeckWithDust: (deckId: import('@/types/starterDecks').StarterDeckId) => boolean;
  checkAndUnlockDecks: () => void;
  awardDust: (amount: number) => void;
  updateMetaStats: (runStats: RunStats) => void;

  // Phase 4: Deck Manipulation
  removeCardFromDeck: (card: Card) => boolean;
  addCardToDeck: (specialCard: SpecialCard) => boolean;
  transformCard: (cardId: string, newRank: string) => boolean;
  getModifiedDeck: () => Card[];

  // Phase 4: Challenge Management
  generateChallenges: () => void;
  removeChallenge: (challengeId: string) => boolean;
  isChallengeActive: (challengeId: string) => boolean;
  applyChallengeModifiers: () => void;

  // Phase 4: Boss Management
  initializeBoss: () => void;
  defeatBoss: () => void;
  applyBossRules: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  deck: createDeck(),
  dealerDeck: [], // Empty initially, populated for boss fights
  playerHand: [],
  dealerHand: [],
  chips: STARTING_CHIPS,
  currentBet: 0,
  lastBet: 5,
  phase: 'betting',
  outcome: null,
  message: 'Place your bet',
  isDoubleDown: false,

  // Phase 2: Initial state
  currentStage: 1,
  stageWins: 0,
  splitState: null,
  runStats: createInitialStats(),
  screen: 'title',

  // Phase 5: Starter Deck Initial state
  activeDeckId: null,

  // Phase 5: Meta-Progression Initial state
  dust: 0,
  totalDust: 0,
  deckUnlocks: loadDeckUnlocks(),
  deckStats: loadAllDeckStats(),
  runStartTime: 0,
  traitTriggersThisRun: 0,
  metaStats: {
    totalVictories: 0,
    totalRuns: 0,
    highestStageReached: 0,
    mostBlackjacksInRun: 0,
  },

  // Phase 3: Edge Initial state
  edge: STARTING_EDGE,
  maxEdge: MAX_EDGE,

  // Phase 3: Powers Initial state
  collectedPowers: [],
  equippedPowers: [],
  powerUsesThisHand: {},
  powerUsesThisStage: {},
  powerUsesThisRun: {},

  // Phase 3: Power Effects Initial state
  peekActive: false,
  dealersTellActive: false,
  luckyDrawOptions: null,
  swapTargetOptions: null,
  swapSelectMode: false,
  quickPeekCard: null,
  cardCountResult: null,
  frozenDealer: false,
  pressuredDealer: false,

  // Phase 3: Power Selection Initial state
  powerSelection: {
    isActive: false,
    options: [],
  },

  // Phase 5: Card Reward Initial state
  cardRewardOptions: null,

  // Phase 5: Special Card Unlocks Initial state
  unlockedSpecialCards: [],

  // Phase 4: Deck Manipulation Initial state
  removedCards: [],
  addedCards: [],
  transformedCards: {},

  // Phase 4: Challenge Initial state
  activeChallenges: [],
  challengeHistory: [],
  blindHandsRemaining: 0,
  blockedPowerId: null,

  // Phase 4: Boss Initial state
  currentBoss: null,
  bossActive: false,

  // Computed getters
  playerValue: () => {
    const { splitState, playerHand } = get();
    if (splitState?.isActive) {
      return calculateHandValue(splitState.hands[splitState.activeHandIndex]);
    }
    return calculateHandValue(playerHand);
  },

  dealerValue: () => calculateHandValue(get().dealerHand),

  canDoubleDown: () => {
    const { playerHand, chips, currentBet, splitState } = get();
    if (splitState?.isActive) {
      const activeHand = splitState.hands[splitState.activeHandIndex];
      return activeHand.length === 2 && chips >= currentBet && !splitState.isSplitAces;
    }
    return playerHand.length === 2 && chips >= currentBet;
  },

  canSplit: () => {
    const { playerHand, chips, currentBet, splitState } = get();
    if (splitState?.isActive || chips < currentBet) return false;
    if (playerHand.length !== 2) return false;
    return playerHand[0].rank === playerHand[1].rank;
  },

  winsNeededForStage: () => {
    const { currentStage } = get();
    return getStage(currentStage).winsRequired;
  },

  isStageComplete: () => {
    const { stageWins } = get();
    return stageWins >= get().winsNeededForStage();
  },

  // Place bet action
  placeBet: (amount: number) => {
    const { chips } = get();
    if (amount > chips || amount < 5) return;

    set({
      currentBet: amount,
      lastBet: amount,
      message: `Bet placed: ${amount} chips`,
    });
  },

  // Deal cards - start a new hand
  deal: () => {
    const { currentBet, chips, quickPeekCard, stackedDeckActive, loadedDiceActive } = get() as any;
    if (currentBet === 0 || currentBet > chips) return;

    // Reset power effects for new hand
    set({
      powerUsesThisHand: {},
      peekActive: false,
      dealersTellActive: false,
      luckyDrawOptions: null,
      swapTargetOptions: null,
      swapSelectMode: false,
      quickPeekCard: null,
      cardCountResult: null,
      frozenDealer: false,
      pressuredDealer: false,
    });

    // Use the existing deck from state (maintain lean deck identity)
    let deck = [...get().deck];

    // During boss fights, dealer draws from their own deck
    const { bossActive, dealerDeck: bossDealerDeck, currentBoss } = get();
    let dealerDeck = bossActive ? [...bossDealerDeck] : deck; // Non-boss: use same deck, not a copy

    // Deal initial cards
    const playerCard1 = drawCard(deck)!;
    const dealerCard1 = drawCard(dealerDeck)!;
    const playerCard2 = drawCard(deck)!;
    const dealerCard2 = drawCard(dealerDeck)!;

    playerCard1.faceUp = true;
    playerCard2.faceUp = true;
    dealerCard1.faceUp = true;

    // Boss hole card visibility rule (The House)
    dealerCard2.faceUp = currentBoss?.holeCardVisible || false;

    const playerHand = [playerCard1, playerCard2];
    const dealerHand = [dealerCard1, dealerCard2];

    set({
      deck,
      dealerDeck: bossActive ? dealerDeck : get().dealerDeck,
      playerHand,
      dealerHand,
      phase: 'dealing',
      message: 'Dealing...',
      outcome: null,
    });

    // Check for natural blackjacks
    setTimeout(() => {
      const playerBJ = isBlackjack(playerHand);
      const dealerBJ = isBlackjack(dealerHand);

      // Check for Golden cards in initial deal
      const goldenCards = getGoldenCardsInHand(playerHand);
      if (goldenCards.length > 0) {
        const { chips } = get();
        const bonus = goldenCards.length * getGoldenCardBonus();
        set({
          chips: chips + bonus,
          message: `✨ Golden card${goldenCards.length > 1 ? 's' : ''}! +${bonus} chips`,
        });
      }

      if (playerBJ || dealerBJ) {
        dealerHand[1].faceUp = true;
        set({ dealerHand: [...dealerHand] });

        if (playerBJ && dealerBJ) {
          set({ phase: 'resolution', outcome: 'push', message: 'Both Blackjack! Push.' });
        } else if (playerBJ) {
          set({ phase: 'resolution', outcome: 'blackjack', message: 'BLACKJACK! You win!' });
        } else {
          set({ phase: 'resolution', outcome: 'lose', message: 'Dealer has Blackjack. You lose.' });
        }
        get().resolveHand();
      } else {
        // Check if Dealer's Tell should activate
        const { dealersTellActive } = get();
        if (dealersTellActive && dealerHand[0].value <= 6) {
          dealerHand[1].faceUp = true;
          set({ dealerHand: [...dealerHand], peekActive: true });
        }

        set({ phase: 'playerTurn', message: 'Your turn - Hit or Stand?' });
      }
    }, 500);
  },

  // Player hits
  hit: () => {
    const { deck, playerHand, phase, splitState, chips, currentBet } = get();
    if (phase !== 'playerTurn') return;

    const card = drawCard(deck);
    if (!card) return;

    card.faceUp = true;

    // Trigger onDraw effects for special cards
    const drawEffect = triggerOnDrawEffects(card, {
      chips,
      playerHand,
      dealerHand: get().dealerHand,
      currentBet,
      deck,
    });

    // Apply chip changes from onDraw effects
    let newChips = chips;
    if (drawEffect.chipsChange) {
      newChips += drawEffect.chipsChange;
    }

    if (splitState?.isActive) {
      const newHands = [...splitState.hands] as [Card[], Card[]];
      newHands[splitState.activeHandIndex] = [...newHands[splitState.activeHandIndex], card];

      set({
        deck: [...deck],
        splitState: { ...splitState, hands: newHands },
        chips: newChips,
        message: drawEffect.message || get().message,
      });

      if (isBust(newHands[splitState.activeHandIndex])) {
        // Check for passive powers on bust
        // TODO: Implement checkBustPowers() for Phase 4
        // get().checkBustPowers();
        // if (!get().splitState) return; // Powers might have prevented bust

        splitState.outcomes[splitState.activeHandIndex] = 'lose';
        set({ message: `Hand ${splitState.activeHandIndex + 1} busts!` });
        setTimeout(() => get().playNextSplitHand(), 800);
      }
    } else {
      const newHand = [...playerHand, card];
      set({
        deck: [...deck],
        playerHand: newHand,
        chips: newChips,
        message: drawEffect.message || get().message,
      });

      const busted = isBust(newHand);

      if (busted) {
        // Check for passive powers on bust
        // TODO: Implement checkBustPowers() for Phase 4
        // get().checkBustPowers();
        // if (!isBust(get().playerHand)) return; // Power prevented bust

        set({ phase: 'resolution', outcome: 'lose', message: 'BUST! You lose.' });
        get().resolveHand();
      } else {
        // Check for Slow Burn trait (Grinder)
        const { activeDeckId, chips, traitTriggersThisRun } = get();
        if (shouldTriggerSlowBurn(activeDeckId, true, busted)) {
          const bonus = calculateSlowBurnBonus();
          set({
            chips: chips + bonus,
            message: formatTraitMessage('grinder', ''),
            traitTriggersThisRun: traitTriggersThisRun + 1
          });
        }

        if (calculateHandValue(newHand).value === BLACKJACK_VALUE) {
          set({ message: '21! Standing...' });
          setTimeout(() => get().stand(), 500);
        }
      }
    }
  },

  // Check for passive bust-prevention powers
  checkBustPowers: () => {
    const { equippedPowers, edge } = get();

    // Safety Net - removes busting card
    if (equippedPowers.includes('safetyNet') && get().canUsePower('safetyNet')) {
      get().executeSafetyNet();
      return;
    }

    // Insurance+ - refunds half bet
    if (equippedPowers.includes('insurancePlus') && get().canUsePower('insurancePlus')) {
      get().executeInsurancePlus();
    }
  },

  // Player stands
  stand: () => {
    const { phase, splitState, activeDeckId, playerHand, chips, traitTriggersThisRun } = get();
    if (phase !== 'playerTurn') return;

    // Check for Power Stance trait (High Roller)
    const playerValue = calculateHandValue(playerHand).value;
    if (shouldTriggerPowerStance(activeDeckId, true, playerValue)) {
      const bonus = calculatePowerStanceBonus();
      set({
        chips: chips + bonus,
        message: formatTraitMessage('highRoller', playerValue.toString()),
        traitTriggersThisRun: traitTriggersThisRun + 1
      });
    }

    if (splitState?.isActive) {
      get().playNextSplitHand();
    } else {
      set({ phase: 'dealerTurn', message: "Dealer's turn..." });
      setTimeout(() => get().dealerPlay(), 500);
    }
  },

  // Double down action
  doubleDown: () => {
    const { phase, currentBet, chips, deck, playerHand, splitState } = get();
    if (phase !== 'playerTurn' || !get().canDoubleDown()) return;
    if (chips < currentBet) return;

    const card = drawCard(deck);
    if (!card) return;

    card.faceUp = true;

    if (splitState?.isActive) {
      const newHands = [...splitState.hands] as [Card[], Card[]];
      const activeIdx = splitState.activeHandIndex;
      newHands[activeIdx] = [...newHands[activeIdx], card];

      const newBets = [...splitState.bets] as [number, number];
      newBets[activeIdx] *= 2;

      set({
        deck: [...deck],
        splitState: { ...splitState, hands: newHands, bets: newBets },
        message: `Hand ${activeIdx + 1} doubled!`,
      });

      if (isBust(newHands[activeIdx])) {
        // TODO: Implement checkBustPowers() for Phase 4
        // get().checkBustPowers();
        const currentSplitState = get().splitState;
        if (currentSplitState && isBust(currentSplitState.hands[activeIdx])) {
          splitState.outcomes[activeIdx] = 'lose';
        }
      }

      setTimeout(() => get().playNextSplitHand(), 800);
    } else {
      const newHand = [...playerHand, card];
      set({
        deck: [...deck],
        playerHand: newHand,
        currentBet: currentBet * 2,
        isDoubleDown: true,
        message: 'Doubled down!',
      });

      if (isBust(newHand)) {
        // TODO: Implement checkBustPowers() for Phase 4
        // get().checkBustPowers();
        // if (isBust(get().playerHand)) {
        set({ phase: 'resolution', outcome: 'lose', message: 'BUST! You lose.' });
        get().resolveHand();
        // }
      } else {
        setTimeout(() => {
          set({ phase: 'dealerTurn', message: "Dealer's turn..." });
          setTimeout(() => get().dealerPlay(), 500);
        }, 800);
      }
    }
  },

  // Split action
  split: () => {
    const { phase, playerHand, currentBet, chips, deck } = get();
    if (phase !== 'playerTurn' || !get().canSplit()) return;

    const isSplitAces = playerHand[0].rank === 'A';

    const hand1 = [playerHand[0]];
    const hand2 = [playerHand[1]];

    const card1 = drawCard(deck)!;
    const card2 = drawCard(deck)!;
    card1.faceUp = true;
    card2.faceUp = true;

    hand1.push(card1);
    hand2.push(card2);

    set({
      deck: [...deck],
      splitState: {
        isActive: true,
        activeHandIndex: 0,
        hands: [hand1, hand2],
        bets: [currentBet, currentBet],
        outcomes: [null, null],
        isSplitAces,
      },
      message: 'Split! Playing Hand 1...',
    });

    if (isSplitAces) {
      setTimeout(() => get().playNextSplitHand(), 1000);
    }
  },

  // Move to next split hand or dealer turn
  playNextSplitHand: () => {
    const { splitState } = get();
    if (!splitState) return;

    if (splitState.activeHandIndex === 0) {
      set({
        splitState: { ...splitState, activeHandIndex: 1 },
        message: 'Playing Hand 2...',
      });

      if (splitState.isSplitAces) {
        setTimeout(() => get().playNextSplitHand(), 1000);
      }
    } else {
      set({ phase: 'dealerTurn', message: "Dealer's turn..." });
      setTimeout(() => get().dealerPlay(), 500);
    }
  },

  // Dealer plays
  dealerPlay: async () => {
    const { dealerHand, deck, dealerDeck: bossDealerDeck, frozenDealer, pressuredDealer, bossActive, currentBoss } = get();

    // Use boss deck if in boss fight, otherwise use player deck
    let dealerDeck = bossActive ? [...bossDealerDeck] : [...deck];

    // Determine dealer stand value (boss override or default)
    const standValue = currentBoss?.dealerStandValue || DEALER_STAND_VALUE;

    // Reveal hole card (unless already revealed by Peek, Dealer's Tell, or Boss rule)
    if (!dealerHand[1].faceUp) {
      dealerHand[1].faceUp = true;
      set({ dealerHand: [...dealerHand] });
      await new Promise(resolve => setTimeout(resolve, DEALER_CARD_DELAY));
    }

    let currentHand = [...dealerHand];

    // Freeze prevents dealer from hitting at all
    if (frozenDealer) {
      set({ message: 'Dealer is frozen!' });
      await new Promise(resolve => setTimeout(resolve, DEALER_CARD_DELAY));
    } else {
      // Boss-specific dealer logic
      const dealerValue = calculateHandValue(currentHand);
      const shouldHitOnSoft17 = currentBoss?.dealerHitsOnSoft17 || false;

      // Dealer AI: hit until reaching stand value, with soft 17 rule
      while (true) {
        const handVal = calculateHandValue(currentHand);

        // Check if dealer should hit
        const shouldHit = handVal.value < standValue ||
                         (handVal.value === 17 && handVal.soft && shouldHitOnSoft17);

        if (!shouldHit) break;

        const card = drawCard(dealerDeck);
        if (!card) break;

        card.faceUp = true;
        currentHand = [...currentHand, card];
        set({
          dealerHand: currentHand,
          dealerDeck: bossActive ? dealerDeck : bossDealerDeck,
          deck: !bossActive ? dealerDeck : deck,
        });
        await new Promise(resolve => setTimeout(resolve, DEALER_CARD_DELAY));
      }

      // Pressure forces one additional hit
      if (pressuredDealer && !isBust(currentHand)) {
        set({ message: 'Dealer is pressured to hit!' });
        await new Promise(resolve => setTimeout(resolve, DEALER_CARD_DELAY));

        const card = drawCard(deck);
        if (card) {
          card.faceUp = true;
          currentHand = [...currentHand, card];
          set({ dealerHand: currentHand, deck: [...deck] });
          await new Promise(resolve => setTimeout(resolve, DEALER_CARD_DELAY));
        }
      }
    }

    set({ phase: 'resolution' });

    const playerValue = get().playerValue().value;
    const dealerValue = get().dealerValue().value;
    const dealerBust = isBust(currentHand);

    // Resolve split hands separately
    if (get().splitState) {
      const { bossActive, currentBoss } = get();
      const splitState = get().splitState!;
      const newOutcomes = [...splitState.outcomes] as [Outcome, Outcome];

      for (let i = 0; i < 2; i++) {
        if (newOutcomes[i] === 'lose') continue;

        const handValue = calculateHandValue(splitState.hands[i]).value;

        if (dealerBust) {
          newOutcomes[i] = 'win';
        } else if (dealerValue > handValue) {
          newOutcomes[i] = 'lose';
        } else if (handValue > dealerValue) {
          newOutcomes[i] = 'win';
        } else {
          // Tie situation - check boss special rules
          if (bossActive && currentBoss) {
            // Pit Boss: Ties at exactly 17 = Pit Boss wins
            if (currentBoss.tiesAt17AreLosses && handValue === 17) {
              newOutcomes[i] = 'lose';
            }
            // The House: ALL ties = House wins
            else if (currentBoss.playerPushesAreLosses) {
              newOutcomes[i] = 'lose';
            } else {
              newOutcomes[i] = 'push';
            }
          } else {
            newOutcomes[i] = 'push';
          }
        }
      }

      set({
        splitState: { ...splitState, outcomes: newOutcomes },
        message: `Hand 1: ${newOutcomes[0]} | Hand 2: ${newOutcomes[1]}`,
      });
    } else {
      const { bossActive, currentBoss } = get();
      let outcome: Outcome = null;
      let message = '';

      if (dealerBust) {
        outcome = 'win';
        message = 'Dealer busts! You win!';
      } else if (dealerValue > playerValue) {
        outcome = 'lose';
        message = `Dealer wins with ${dealerValue}.`;
      } else if (playerValue > dealerValue) {
        outcome = 'win';
        message = `You win with ${playerValue}!`;
      } else {
        // Tie situation - check boss special rules
        if (bossActive && currentBoss) {
          // Pit Boss: Ties at exactly 17 = Pit Boss wins
          if (currentBoss.tiesAt17AreLosses && playerValue === 17) {
            outcome = 'lose';
            message = `Veteran's Patience! Tie at 17 = ${currentBoss.name} wins!`;
          }
          // The House: ALL ties = House wins
          else if (currentBoss.playerPushesAreLosses) {
            outcome = 'lose';
            message = `House Edge! Tie at ${playerValue} = ${currentBoss.name} wins!`;
          } else {
            outcome = 'push';
            message = `Push at ${playerValue}.`;
          }
        } else {
          outcome = 'push';
          message = `Push at ${playerValue}.`;
        }
      }

      set({ outcome, message });
    }

    get().resolveHand();
  },

  // Resolve hand - calculate payouts and update stats
  resolveHand: () => {
    const { outcome, currentBet, chips, splitState, currentStage, edge, activeDeckId, isDoubleDown, playerHand, dealerHand } = get();
    let newChips = chips;
    let didWin = false;
    const specialCardMessages: string[] = [];

    if (splitState) {
      for (let i = 0; i < 2; i++) {
        const handOutcome = splitState.outcomes[i];
        const bet = splitState.bets[i];

        if (handOutcome === 'win') {
          newChips += bet;
          didWin = true;

          // Trigger onWin effects for this split hand
          const winEffect = triggerOnWinEffects(splitState.hands[i], {
            chips: newChips,
            playerHand: splitState.hands[i],
            dealerHand,
            currentBet: bet,
            deck: get().deck,
            outcome: 'win',
          });
          if (winEffect.chipsChange) newChips += winEffect.chipsChange;
          if (winEffect.message) specialCardMessages.push(winEffect.message);
        } else if (handOutcome === 'lose') {
          newChips -= bet;

          // Boss special rule: The Shark - Extra chip loss on loss
          const { bossActive, currentBoss } = get();
          if (bossActive && currentBoss?.extraChipLossOnLoss) {
            newChips -= currentBoss.extraChipLossOnLoss;
            specialCardMessages.push(`Blood in the Water! -${currentBoss.extraChipLossOnLoss} extra chips!`);
          }

          // Trigger onLose effects for this split hand
          const loseEffect = triggerOnLoseEffects(splitState.hands[i], {
            chips: newChips,
            playerHand: splitState.hands[i],
            dealerHand,
            currentBet: bet,
            deck: get().deck,
            outcome: 'lose',
          });
          if (loseEffect.chipsChange) newChips += loseEffect.chipsChange;
          if (loseEffect.message) specialCardMessages.push(loseEffect.message);
        }
      }
    } else {
      if (outcome === 'win') {
        // Check for All or Nothing trait (Gambler) on double down
        if (isDoubleDown && activeDeckId === 'gambler') {
          const { payout } = getDoubleDownPayout(activeDeckId, true, currentBet / 2); // currentBet is already doubled
          newChips += payout;
          set({
            message: formatTraitMessage('gambler', 'win'),
            traitTriggersThisRun: get().traitTriggersThisRun + 1
          });
        } else {
          newChips += currentBet;
        }
        didWin = true;

        // Trigger onWin effects
        const winEffect = triggerOnWinEffects(playerHand, {
          chips: newChips,
          playerHand,
          dealerHand,
          currentBet,
          deck: get().deck,
          outcome: 'win',
        });
        if (winEffect.chipsChange) newChips += winEffect.chipsChange;
        if (winEffect.message) specialCardMessages.push(winEffect.message);
      } else if (outcome === 'blackjack') {
        // Check for Ace in the Hole trait (Ace Master)
        const blackjackPayout = getBlackjackPayout(activeDeckId, BLACKJACK_PAYOUT);
        newChips += Math.floor(currentBet * blackjackPayout);
        didWin = true;

        // Trigger onBlackjack effects
        const bjEffect = triggerOnBlackjackEffects(playerHand, {
          chips: newChips,
          playerHand,
          dealerHand,
          currentBet,
          deck: get().deck,
          outcome: 'blackjack',
          isBlackjack: true,
        });
        if (bjEffect.chipsChange) newChips += bjEffect.chipsChange;
        if (bjEffect.message) specialCardMessages.push(bjEffect.message);

        // Show trait message if applicable
        if (activeDeckId === 'aceHunter') {
          set({
            message: formatTraitMessage('aceHunter', 'blackjack'),
            traitTriggersThisRun: get().traitTriggersThisRun + 1
          });
        }
      } else if (outcome === 'lose') {
        // Check for All or Nothing trait (Gambler) on double down loss
        if (isDoubleDown && activeDeckId === 'gambler') {
          const { extraCost } = getDoubleDownPayout(activeDeckId, false, currentBet / 2);
          newChips -= (currentBet + extraCost);
          set({
            message: formatTraitMessage('gambler', 'lose'),
            traitTriggersThisRun: get().traitTriggersThisRun + 1
          });
        } else {
          newChips -= currentBet;
        }

        // Boss special rule: The Shark - Extra chip loss on loss
        const { bossActive, currentBoss } = get();
        if (bossActive && currentBoss?.extraChipLossOnLoss) {
          newChips -= currentBoss.extraChipLossOnLoss;
          specialCardMessages.push(`Blood in the Water! -${currentBoss.extraChipLossOnLoss} extra chips!`);
        }

        // Trigger onLose effects
        const loseEffect = triggerOnLoseEffects(playerHand, {
          chips: newChips,
          playerHand,
          dealerHand,
          currentBet,
          deck: get().deck,
          outcome: 'lose',
        });
        if (loseEffect.chipsChange) newChips += loseEffect.chipsChange;
        if (loseEffect.message) specialCardMessages.push(loseEffect.message);
      }
    }

    let newStageWins = get().stageWins;
    if (didWin) {
      newStageWins += 1;
    }

    // Regenerate Edge after hand
    get().regenerateEdge(EDGE_PER_HAND);

    // Update chips and append special card messages
    const currentMessage = get().message;
    const finalMessage = specialCardMessages.length > 0
      ? `${currentMessage} | ${specialCardMessages.join(' | ')}`
      : currentMessage;

    set({
      chips: newChips,
      stageWins: newStageWins,
      message: finalMessage,
    });

    // Check for game over
    if (newChips <= 0) {
      set({ chips: 0, screen: 'gameOver', message: 'Game Over! Out of chips.' });
      return;
    }

    // Check for stage complete
    if (newStageWins >= get().winsNeededForStage()) {
      // Bonus Edge for clearing stage
      get().regenerateEdge(EDGE_STAGE_BONUS);

      if (isFinalStage(currentStage)) {
        // Victory - update meta stats
        get().updateMetaStats(get().runStats);
        set({ screen: 'victory', message: 'VICTORY! You conquered the Ascent!' });
      } else {
        set({ screen: 'stageComplete', message: `Stage ${currentStage} cleared!` });
      }
    }
  },

  // Reset for next hand
  resetHand: () => {
    const { chips, lastBet, activeDeckId, deck: currentDeck, runStats, bossActive, currentBoss, dealerDeck: bossDealerDeck } = get();
    if (chips === 0) {
      // Game over - update meta stats
      get().updateMetaStats(runStats);
      set({ screen: 'gameOver' });
      return;
    }

    const suggestedBet = Math.min(lastBet, chips);

    // Maintain the lean deck: regenerate from active deck ID if too few cards, otherwise shuffle
    const newDeck = currentDeck.length < 10 && activeDeckId
      ? generateStarterDeck(activeDeckId)
      : shuffle([...currentDeck]);

    // Boss fights: Regenerate boss deck if it's running low
    let newDealerDeck = bossDealerDeck;
    if (bossActive && currentBoss) {
      if (bossDealerDeck.length < 4) {
        // Boss deck running low - reshuffle the boss's premade deck
        newDealerDeck = shuffle([...currentBoss.deck]);
      } else {
        // Just shuffle existing boss deck
        newDealerDeck = shuffle([...bossDealerDeck]);
      }
    }

    set({
      deck: newDeck,
      dealerDeck: newDealerDeck,
      playerHand: [],
      dealerHand: [],
      currentBet: 0,
      phase: 'betting',
      outcome: null,
      isDoubleDown: false,
      splitState: null,
      message: `Place your bet (last: ${suggestedBet})`,
      // Reset power effects
      powerUsesThisHand: {},
      peekActive: false,
      luckyDrawOptions: null,
      swapTargetOptions: null,
      swapSelectMode: false,
      quickPeekCard: null,
      cardCountResult: null,
      frozenDealer: false,
      pressuredDealer: false,
      dealersTellActive: false,
    });
  },

  // Advance to next stage
  advanceStage: () => {
    const { currentStage } = get();

    // Phase 3: Offer power selection
    get().offerPowerSelection();

    // Phase 4: Relic selection will be triggered after power selection
    // (handled in selectPower or power selection skip)

    set({
      currentStage: currentStage + 1,
      stageWins: 0,
      powerUsesThisStage: {}, // Reset stage power uses
      message: `Stage ${currentStage + 1}: ${getStage(currentStage + 1).name}`,
    });
  },

  // Start a completely new run
  startNewRun: () => {
    set({
      deck: createDeck(),
      playerHand: [],
      dealerHand: [],
      chips: STARTING_CHIPS,
      currentBet: 0,
      lastBet: 5,
      phase: 'betting',
      outcome: null,
      message: 'Place your bet',
      currentStage: 1,
      stageWins: 0,
      splitState: null,
      runStats: createInitialStats(),
      screen: 'game',
      // Phase 3: Reset Edge and Powers
      edge: STARTING_EDGE,
      maxEdge: MAX_EDGE,
      collectedPowers: [],
      equippedPowers: [],
      powerUsesThisHand: {},
      powerUsesThisStage: {},
      powerUsesThisRun: {},
      peekActive: false,
      dealersTellActive: false,
      luckyDrawOptions: null,
      swapTargetOptions: null,
      swapSelectMode: false,
      quickPeekCard: null,
      cardCountResult: null,
      frozenDealer: false,
      pressuredDealer: false,
      powerSelection: {
        isActive: false,
        options: [],
      },
    });
  },

  // Phase 5: Start a run with a selected starter deck
  startRunWithDeck: (deckId: StarterDeckId) => {
    const starterDeck = getStarterDeck(deckId);

    // Generate the lean starting deck (12-16 cards)
    const deck = generateStarterDeck(deckId);

    // Get starting power if specified
    const startingPower = starterDeck.startingPowerId ? POWER_POOL[starterDeck.startingPowerId] : null;

    set({
      deck,
      playerHand: [],
      dealerHand: [],
      chips: starterDeck.startingChips,
      currentBet: 0,
      lastBet: 5,
      phase: 'betting',
      outcome: null,
      message: `${starterDeck.name} - ${starterDeck.tagline}`,
      currentStage: 1,
      stageWins: 0,
      splitState: null,
      runStats: createInitialStats(),
      screen: 'game',
      // Phase 5: Set active deck for trait system and tracking
      activeDeckId: deckId,
      runStartTime: Date.now(),
      traitTriggersThisRun: 0,
      // Phase 3: Reset Edge and Powers (use starter deck values)
      edge: starterDeck.startingEdge,
      maxEdge: starterDeck.maxEdge,
      collectedPowers: startingPower ? [startingPower] : [],
      equippedPowers: startingPower ? [startingPower.id] : [],
      powerUsesThisHand: {},
      powerUsesThisStage: {},
      powerUsesThisRun: {},
      peekActive: false,
      dealersTellActive: false,
      luckyDrawOptions: null,
      swapTargetOptions: null,
      swapSelectMode: false,
      quickPeekCard: null,
      cardCountResult: null,
      frozenDealer: false,
      pressuredDealer: false,
      powerSelection: {
        isActive: false,
        options: [],
      },
      // Phase 4: Reset Challenges, Boss
      activeChallenges: [],
      // challengesOffered: [], // TODO: Add to interface if needed
      currentBoss: null,
      bossActive: false,
      // dealerBustCount: 0, // TODO: Add to interface if needed for bosses
      // dealerLowHandCount: 0, // TODO: Add to interface if needed for bosses
      // goldCardsDrawn: 0, // TODO: Add to interface if needed for bosses
      blindHandsRemaining: 0,
      blockedPowerId: null,
    });
  },

  // Record hand result (for stats)
  recordHandResult: (result: HandResult) => {
    const { runStats, chips } = get();
    const newStats = updateStatsWithHandResult(runStats, result, chips);
    set({ runStats: newStats });
  },

  // Set screen
  setScreen: (screen: Screen) => {
    set({ screen });
  },

  // ============================================================================
  // PHASE 3: EDGE MANAGEMENT
  // ============================================================================

  spendEdge: (amount: number) => {
    const { edge } = get();
    if (edge < amount) return false;

    set({ edge: edge - amount });
    return true;
  },

  regenerateEdge: (amount: number) => {
    const { edge, maxEdge } = get();
    const newEdge = Math.min(edge + amount, maxEdge);
    set({ edge: newEdge });
  },

  // ============================================================================
  // PHASE 3: POWER MANAGEMENT
  // ============================================================================

  selectPower: (powerId: string) => {
    const power = POWER_POOL[powerId];
    if (!power) return;

    const { collectedPowers, equippedPowers } = get();

    // Add to collected
    const newCollected = [...collectedPowers, power];

    // Auto-equip if space available
    let newEquipped = [...equippedPowers];
    if (newEquipped.length < MAX_EQUIPPED_POWERS) {
      newEquipped.push(powerId);
    }

    set({
      collectedPowers: newCollected,
      equippedPowers: newEquipped,
      powerSelection: { isActive: false, options: [] },
    });

    // NEW FLOW: Power → Card Reward → Deck Shop
    get().offerCardReward();
  },

  equipPower: (powerId: string) => {
    const { collectedPowers, equippedPowers } = get();
    const power = collectedPowers.find(p => p.id === powerId);

    if (!power || equippedPowers.length >= MAX_EQUIPPED_POWERS) return;
    if (equippedPowers.includes(powerId)) return; // Already equipped

    set({ equippedPowers: [...equippedPowers, powerId] });
  },

  unequipPower: (powerId: string) => {
    const { equippedPowers } = get();
    set({ equippedPowers: equippedPowers.filter(id => id !== powerId) });
  },

  offerPowerSelection: () => {
    const { currentStage, collectedPowers } = get();
    const allowedTiers = getAllowedTiersForStage(currentStage + 1);
    const excludeIds = collectedPowers.map(p => p.id);

    // Get 3 random powers
    const options = getRandomPowers(3, excludeIds, allowedTiers);

    if (options.length === 0) {
      // No more powers available, skip selection
      set({ screen: 'game' });
      return;
    }

    // Store options and show selection screen
    set({
      powerSelection: { isActive: true, options },
      screen: 'powerSelection'
    });
  },

  // ============================================================================
  // PHASE 3: POWER USAGE
  // ============================================================================

  canUsePower: (powerId: string) => {
    const {
      equippedPowers,
      edge,
      phase,
      powerUsesThisHand,
      powerUsesThisStage,
      powerUsesThisRun
    } = get();

    // Check if power is equipped
    if (!equippedPowers.includes(powerId)) return false;

    const power = POWER_POOL[powerId];
    if (!power) return false;

    // Check Edge cost
    if (edge < power.cost) return false;

    // Check timing
    const timingMap: Record<string, boolean> = {
      preDeal: phase === 'betting',
      playerTurn: phase === 'playerTurn',
      preDealer: phase === 'dealerTurn',
      onBust: false, // Passive, checked elsewhere
    };
    if (!timingMap[power.timing]) return false;

    // Check usage limits
    if (power.usesPerHand && (powerUsesThisHand[powerId] || 0) >= power.usesPerHand) return false;
    if (power.usesPerStage && (powerUsesThisStage[powerId] || 0) >= power.usesPerStage) return false;
    if (power.usesPerRun && (powerUsesThisRun[powerId] || 0) >= power.usesPerRun) return false;

    return true;
  },

  usePower: (powerId: string) => {
    if (!get().canUsePower(powerId)) return;

    const power = POWER_POOL[powerId];
    if (!get().spendEdge(power.cost)) return;

    get().recordPowerUse(powerId, power.cost);

    // Execute power effect
    const executors: Record<string, () => void> = {
      peek: get().executePeek,
      cardCount: get().executeCardCount,
      insurancePlus: get().executeInsurancePlus,
      quickPeek: get().executeQuickPeek,
      swap: () => {
        const { playerHand } = get();
        set({ swapTargetOptions: playerHand, message: 'Select a card to swap' });
      },
      pressure: get().executePressure,
      luckyDraw: get().executeLuckyDraw,
      safetyNet: get().executeSafetyNet,
      freeze: get().executeFreeze,
      secondChance: get().executeSecondChance,
      stackedDeck: get().executeStackedDeck,
      dealersTell: get().executeDealersTell,
      loadedDice: get().executeLoadedDice,
      doubleAgent: get().executeDoubleAgent,
      timeWarp: get().executeTimeWarp,
      perfectShuffle: get().executePerfectShuffle,
    };

    executors[powerId]?.();
  },

  recordPowerUse: (powerId: string, edgeCost: number) => {
    const { powerUsesThisHand, powerUsesThisStage, powerUsesThisRun, runStats } = get();

    set({
      powerUsesThisHand: { ...powerUsesThisHand, [powerId]: (powerUsesThisHand[powerId] || 0) + 1 },
      powerUsesThisStage: { ...powerUsesThisStage, [powerId]: (powerUsesThisStage[powerId] || 0) + 1 },
      powerUsesThisRun: { ...powerUsesThisRun, [powerId]: (powerUsesThisRun[powerId] || 0) + 1 },
      runStats: {
        ...runStats,
        totalEdgeSpent: runStats.totalEdgeSpent + edgeCost,
        totalPowersUsed: runStats.totalPowersUsed + 1,
        powerUsageCount: {
          ...runStats.powerUsageCount,
          [powerId]: (runStats.powerUsageCount[powerId] || 0) + 1,
        },
      },
    });
  },

  // ============================================================================
  // PHASE 3: POWER EFFECTS - TIER 1
  // ============================================================================

  executePeek: () => {
    const { dealerHand } = get();
    dealerHand[1].faceUp = true;
    set({ dealerHand: [...dealerHand], peekActive: true, message: 'Dealer hole card revealed!' });
  },

  executeCardCount: () => {
    const { deck } = get();
    const tenCount = deck.filter(c => c.value === 10).length;
    set({ cardCountResult: tenCount, message: `${tenCount} ten-value cards remain in deck` });
  },

  executeInsurancePlus: () => {
    const { currentBet, chips, runStats } = get();
    const refund = Math.floor(currentBet / 2);
    set({
      chips: chips + refund,
      message: `Insurance+ activated! Refunded ${refund} chips`,
      runStats: { ...runStats, clutchSaves: runStats.clutchSaves + 1 }
    });
  },

  executeQuickPeek: () => {
    const { deck } = get();
    if (deck.length > 0) {
      set({ quickPeekCard: deck[deck.length - 1], message: `Next card: ${deck[deck.length - 1].rank}${deck[deck.length - 1].suit[0]}` });
    }
  },

  // ============================================================================
  // PHASE 3: POWER EFFECTS - TIER 2
  // ============================================================================

  executeSwap: (cardIndex: number) => {
    const { deck, playerHand, splitState } = get();
    if (deck.length === 0) return;

    const topCard = drawCard(deck)!;
    topCard.faceUp = true;

    if (splitState?.isActive) {
      const newHands = [...splitState.hands] as [Card[], Card[]];
      const activeIdx = splitState.activeHandIndex;
      const swappedCard = newHands[activeIdx][cardIndex];
      newHands[activeIdx][cardIndex] = topCard;
      deck.push(swappedCard);

      set({
        deck: [...deck],
        splitState: { ...splitState, hands: newHands },
        swapTargetOptions: null,
        message: `Swapped ${swappedCard.rank} for ${topCard.rank}!`,
      });
    } else {
      const newHand = [...playerHand];
      const swappedCard = newHand[cardIndex];
      newHand[cardIndex] = topCard;
      deck.push(swappedCard);

      set({
        deck: [...deck],
        playerHand: newHand,
        swapTargetOptions: null,
        message: `Swapped ${swappedCard.rank} for ${topCard.rank}!`,
      });
    }
  },

  executePressure: () => {
    set({ pressuredDealer: true, message: 'Dealer will be forced to hit!' });
  },

  executeLuckyDraw: () => {
    const { deck } = get();
    if (deck.length < 2) return;

    const card1 = drawCard(deck)!;
    const card2 = drawCard(deck)!;

    set({
      luckyDrawOptions: [card1, card2],
      message: 'Choose a card to add to your hand'
    });
  },

  selectLuckyCard: (index: 0 | 1) => {
    const { luckyDrawOptions, playerHand, deck, splitState } = get();
    if (!luckyDrawOptions) return;

    const selectedCard = luckyDrawOptions[index];
    const rejectedCard = luckyDrawOptions[index === 0 ? 1 : 0];
    selectedCard.faceUp = true;

    // Put rejected card at bottom of deck
    deck.unshift(rejectedCard);

    if (splitState?.isActive) {
      const newHands = [...splitState.hands] as [Card[], Card[]];
      newHands[splitState.activeHandIndex].push(selectedCard);
      set({
        splitState: { ...splitState, hands: newHands },
        luckyDrawOptions: null,
        deck: [...deck],
        message: `Added ${selectedCard.rank} to hand`,
      });
    } else {
      const newHand = [...playerHand, selectedCard];
      set({
        playerHand: newHand,
        luckyDrawOptions: null,
        deck: [...deck],
        message: `Added ${selectedCard.rank} to hand`,
      });
    }
  },

  executeSafetyNet: () => {
    const { playerHand, splitState, runStats } = get();

    if (splitState?.isActive) {
      const newHands = [...splitState.hands] as [Card[], Card[]];
      const activeIdx = splitState.activeHandIndex;
      newHands[activeIdx].pop(); // Remove busting card
      set({
        splitState: { ...splitState, hands: newHands },
        message: 'Safety Net activated! Busting card removed',
        runStats: { ...runStats, clutchSaves: runStats.clutchSaves + 1 }
      });
    } else {
      const newHand = [...playerHand];
      newHand.pop(); // Remove busting card
      set({
        playerHand: newHand,
        message: 'Safety Net activated! Busting card removed',
        runStats: { ...runStats, clutchSaves: runStats.clutchSaves + 1 }
      });
    }
  },

  // ============================================================================
  // PHASE 3: POWER EFFECTS - TIER 3
  // ============================================================================

  executeFreeze: () => {
    set({ frozenDealer: true, message: 'Dealer is frozen and cannot hit!' });
  },

  executeSecondChance: () => {
    // TODO: Implement undo last action - complex state rewind
    set({ message: 'Second Chance activated! (Implementation pending)' });
  },

  executeStackedDeck: () => {
    // Mark that next card should be 10-value (handled in deal logic)
    set({ stackedDeckActive: true, message: 'Deck is stacked! Next card will be 10-value' } as any);
  },

  executeDealersTell: () => {
    set({ dealersTellActive: true, message: 'Dealer\'s Tell activated for this hand!' });
  },

  // ============================================================================
  // PHASE 3: POWER EFFECTS - TIER 4
  // ============================================================================

  executeLoadedDice: () => {
    // Mark that both starting cards should be 10+ (handled in deal logic)
    set({ loadedDiceActive: true, message: 'Loaded Dice! Both cards will be 10 or higher' } as any);
  },

  executeDoubleAgent: () => {
    const { playerHand, dealerHand } = get();
    // Swap hands completely
    set({
      playerHand: [...dealerHand].map(c => ({ ...c, faceUp: true })),
      dealerHand: [...playerHand].map((c, i) => ({ ...c, faceUp: i === 0 })),
      message: 'Double Agent! Hands swapped!',
    });
  },

  executeTimeWarp: () => {
    // TODO: Implement full hand replay - very complex
    set({ message: 'Time Warp activated! (Implementation pending)' });
  },

  executePerfectShuffle: () => {
    const { deck } = get();
    set({ deck: shuffle([...deck]), message: 'Deck reshuffled!' });
  },

  // ============================================================================
  // RELICS REMOVED - Now using Special Cards instead

  // ============================================================================
  // PHASE 5: CARD REWARD SYSTEM
  // ============================================================================

  offerCardReward: () => {
    const { currentStage, activeDeckId } = get();
    const options = generateCardRewards(currentStage, activeDeckId);

    set({
      cardRewardOptions: options,
      screen: 'cardReward',
    });
  },

  selectCardReward: (optionIndex: number) => {
    const { cardRewardOptions, deck, runStats } = get();

    if (!cardRewardOptions || optionIndex >= cardRewardOptions.length) return;

    const selectedOption = cardRewardOptions[optionIndex];
    const newCard = selectedOption.card;

    // Add card to deck
    const newDeck = [...deck, newCard];

    // Track special cards in stats
    const isSpecialCard = !!newCard.special;
    const specialCardDef = newCard.special ? ALL_SPECIAL_CARDS[newCard.special] : null;
    const newStats = {
      ...runStats,
      cardsAdded: runStats.cardsAdded + 1,
    };

    if (isSpecialCard && specialCardDef) {
      newStats.specialCardsCollected = runStats.specialCardsCollected + 1;
      newStats.specialCardNames = [...runStats.specialCardNames, specialCardDef.name];
    }

    set({
      deck: newDeck,
      cardRewardOptions: null,
      runStats: newStats,
      message: `Added ${specialCardDef ? specialCardDef.displayName : newCard.rank} to deck`,
      screen: 'deckShop', // Continue to deck shop
    });
  },

  skipCardReward: () => {
    set({
      cardRewardOptions: null,
      screen: 'deckShop', // Continue to deck shop
    });
  },

  // ============================================================================
  // PHASE 5: META-PROGRESSION & UNLOCKS
  // ============================================================================

  loadMetaProgress: () => {
    if (typeof window === 'undefined') return;

    try {
      const savedDust = localStorage.getItem('blackjack_dust');
      const savedTotalDust = localStorage.getItem('blackjack_total_dust');
      const savedMetaStats = localStorage.getItem('blackjack_meta_stats');

      set({
        dust: savedDust ? parseInt(savedDust) : 0,
        totalDust: savedTotalDust ? parseInt(savedTotalDust) : 0,
        metaStats: savedMetaStats ? JSON.parse(savedMetaStats) : {
          totalVictories: 0,
          totalRuns: 0,
          highestStageReached: 0,
          mostBlackjacksInRun: 0,
        },
        deckUnlocks: loadDeckUnlocks(),
      });
    } catch (error) {
      console.error('Failed to load meta progress:', error);
    }
  },

  saveMetaProgress: () => {
    if (typeof window === 'undefined') return;

    try {
      const { dust, totalDust, metaStats, deckUnlocks } = get();
      localStorage.setItem('blackjack_dust', dust.toString());
      localStorage.setItem('blackjack_total_dust', totalDust.toString());
      localStorage.setItem('blackjack_meta_stats', JSON.stringify(metaStats));
      saveDeckUnlocks(deckUnlocks as Record<StarterDeckId, DeckUnlockStatus>);
    } catch (error) {
      console.error('Failed to save meta progress:', error);
    }
  },

  unlockDeckWithDust: (deckId: StarterDeckId) => {
    const { dust, deckUnlocks } = get();
    const cost = DECK_UNLOCK_COSTS[deckId];

    // Check if already unlocked
    if (deckUnlocks[deckId]?.unlocked) {
      set({ message: 'Deck already unlocked!' });
      return false;
    }

    // Check if enough dust
    if (dust < cost) {
      set({ message: `Not enough Dust! Need ${cost}, have ${dust}` });
      return false;
    }

    // Unlock the deck
    const newUnlocks = unlockDeck(deckId, 'dust', deckUnlocks as Record<StarterDeckId, DeckUnlockStatus>);

    set({
      dust: dust - cost,
      deckUnlocks: newUnlocks,
      message: `Unlocked ${getStarterDeck(deckId).name} with ${cost} Dust!`,
    });

    get().saveMetaProgress();
    return true;
  },

  checkAndUnlockDecks: () => {
    const { metaStats, deckUnlocks } = get();
    const { unlocked, newUnlocks } = checkAutoUnlocks(metaStats, deckUnlocks as Record<StarterDeckId, DeckUnlockStatus>);

    if (unlocked.length > 0) {
      set({ deckUnlocks: newUnlocks });
      get().saveMetaProgress();

      // Show notification for first unlock
      if (unlocked.length === 1) {
        const deck = getStarterDeck(unlocked[0]);
        set({ message: `🎉 New Deck Unlocked: ${deck.name}!` });
      } else {
        set({ message: `🎉 ${unlocked.length} New Decks Unlocked!` });
      }
    }
  },

  awardDust: (amount: number) => {
    const { dust, totalDust } = get();
    set({
      dust: dust + amount,
      totalDust: totalDust + amount,
    });
    get().saveMetaProgress();
  },

  updateMetaStats: (runStats: RunStats) => {
    const { metaStats, currentStage, activeDeckId, chips, deckStats, runStartTime, traitTriggersThisRun } = get();
    const isVictory = currentStage >= 8;

    const newMetaStats = {
      totalVictories: metaStats.totalVictories + (isVictory ? 1 : 0),
      totalRuns: metaStats.totalRuns + 1,
      highestStageReached: Math.max(metaStats.highestStageReached, currentStage),
      mostBlackjacksInRun: Math.max(metaStats.mostBlackjacksInRun, runStats.blackjacksHit),
    };

    // Update deck-specific stats
    if (activeDeckId) {
      const runDuration = Date.now() - runStartTime;
      const newDeckStats = updateDeckStats(
        activeDeckId,
        runStats,
        currentStage,
        chips,
        runDuration,
        traitTriggersThisRun,
        deckStats as Record<StarterDeckId, DeckStats>
      );
      set({ deckStats: newDeckStats });
    }

    set({ metaStats: newMetaStats });
    get().saveMetaProgress();
    get().checkAndUnlockDecks();

    // Award Dust based on performance
    const dustEarned = calculateDustReward(currentStage, isVictory, runStats);
    if (dustEarned > 0) {
      get().awardDust(dustEarned);
    }
  },

  // ============================================================================
  // PHASE 5: SPECIAL CARD UNLOCKS
  // ============================================================================

  unlockSpecialCard: (cardId: string) => {
    const { unlockedSpecialCards, dust } = get();
    const card = ALL_SPECIAL_CARDS[cardId];

    if (!card) return false;
    if (unlockedSpecialCards.includes(cardId)) return false; // Already unlocked
    if (dust < card.unlockCost) return false; // Not enough dust

    set({
      unlockedSpecialCards: [...unlockedSpecialCards, cardId],
      dust: dust - card.unlockCost,
      message: `✨ Unlocked ${card.name}!`,
    });

    get().saveMetaProgress();
    return true;
  },

  isSpecialCardUnlocked: (cardId: string) => {
    const { unlockedSpecialCards } = get();
    const card = ALL_SPECIAL_CARDS[cardId];

    if (!card) return false;
    return card.startUnlocked || unlockedSpecialCards.includes(cardId);
  },

  // ============================================================================
  // PHASE 4: DECK MANIPULATION
  // ============================================================================

  removeCardFromDeck: (card: Card) => {
    const { removedCards, chips, runStats } = get();
    const cost = 10;

    if (chips < cost) return false;

    // Check minimum deck size (40 cards)
    const currentDeckSize = 52 - removedCards.length;
    if (currentDeckSize <= 40) {
      set({ message: 'Cannot remove more cards (minimum 40)' });
      return false;
    }

    set({
      removedCards: [...removedCards, card],
      chips: chips - cost,
      runStats: {
        ...runStats,
        cardsRemoved: runStats.cardsRemoved + 1,
        chipsSpentOnDeck: runStats.chipsSpentOnDeck + cost,
      },
      message: `Removed ${card.rank}${card.suit[0]} from deck`,
    });

    return true;
  },

  addCardToDeck: (specialCard: SpecialCard) => {
    const { addedCards, chips, runStats } = get();
    const cost = 15;

    if (chips < cost) return false;

    set({
      addedCards: [...addedCards, specialCard],
      chips: chips - cost,
      runStats: {
        ...runStats,
        cardsAdded: runStats.cardsAdded + 1,
        chipsSpentOnDeck: runStats.chipsSpentOnDeck + cost,
      },
      message: `Added ${specialCard.specialType} to deck`,
    });

    return true;
  },

  transformCard: (cardId: string, newRank: string) => {
    const { transformedCards, chips, runStats } = get();
    const cost = 8;

    if (chips < cost) return false;

    set({
      transformedCards: { ...transformedCards, [cardId]: newRank },
      chips: chips - cost,
      runStats: {
        ...runStats,
        cardsTransformed: runStats.cardsTransformed + 1,
        chipsSpentOnDeck: runStats.chipsSpentOnDeck + cost,
      },
      message: `Transformed card to ${newRank}`,
    });

    return true;
  },

  getModifiedDeck: () => {
    const { removedCards, addedCards, transformedCards, activeDeckId } = get();

    // Start with the lean deck from active deck ID if available, otherwise standard deck
    let deck = activeDeckId ? generateStarterDeck(activeDeckId) : createDeck();

    // Remove cards
    deck = deck.filter(c =>
      !removedCards.some(rc => rc.rank === c.rank && rc.suit === c.suit)
    );

    // Add special cards
    deck = [...deck, ...addedCards];

    // Transform cards (simplified - would need card IDs in real implementation)
    // TODO: Implement proper card transformation tracking

    return deck;
  },

  // ============================================================================
  // PHASE 4: CHALLENGE MANAGEMENT
  // ============================================================================

  generateChallenges: () => {
    const { currentStage } = get();
    const count = getChallengesForStage(currentStage + 1);

    if (count === 0) {
      // No challenges, skip to boss check
      if (isBossStage(currentStage + 1)) {
        get().initializeBoss();
      } else {
        set({ screen: 'game' });
        get().resetHand();
      }
      return;
    }

    const challenges = getRandomChallenges(count);

    set({
      activeChallenges: challenges,
      screen: 'challengeScreen',
    });
  },

  removeChallenge: (challengeId: string) => {
    const { activeChallenges, chips, runStats, challengeHistory, currentStage } = get();
    const challenge = activeChallenges.find(c => c.id === challengeId);

    if (!challenge || chips < challenge.removeCost) return false;

    const newChallenges = activeChallenges.filter(c => c.id !== challengeId);

    // Update history
    const history = [...challengeHistory];
    const currentHistory = history.find(h => h.stage === currentStage + 1);
    if (currentHistory) {
      currentHistory.removed.push(challengeId);
    } else {
      history.push({
        stage: currentStage + 1,
        faced: activeChallenges.map(c => c.id),
        removed: [challengeId],
      });
    }

    set({
      activeChallenges: newChallenges,
      chips: chips - challenge.removeCost,
      challengeHistory: history,
      runStats: {
        ...runStats,
        challengesRemoved: runStats.challengesRemoved + 1,
        chipsSpentOnChallenges: runStats.chipsSpentOnChallenges + challenge.removeCost,
      },
      message: `Removed challenge: ${challenge.name}`,
    });

    return true;
  },

  isChallengeActive: (challengeId: string) => {
    return get().activeChallenges.some(c => c.id === challengeId);
  },

  applyChallengeModifiers: () => {
    const { activeChallenges } = get();

    // Apply challenge effects at start of stage
    activeChallenges.forEach(challenge => {
      switch (challenge.id) {
        case 'taxCollector':
          const { chips } = get();
          set({ chips: Math.max(0, chips - 5), message: 'Tax Collector took 5 chips!' });
          break;

        case 'coldDeck':
          set({ blindHandsRemaining: 2 });
          break;

        case 'powerBlock':
          const { equippedPowers } = get();
          if (equippedPowers.length > 0) {
            const randomPower = equippedPowers[Math.floor(Math.random() * equippedPowers.length)];
            set({ blockedPowerId: randomPower, message: `Power blocked: ${POWER_POOL[randomPower]?.name}` });
          }
          break;
      }
    });
  },

  // ============================================================================
  // PHASE 4: BOSS MANAGEMENT
  // ============================================================================

  initializeBoss: () => {
    const { currentStage } = get();
    const boss = getBossForStage(currentStage + 1);

    if (!boss) {
      // No boss, start stage
      set({ screen: 'game' });
      get().resetHand();
      return;
    }

    // Set up boss's premade deck (shuffle it for fairness)
    const bossDeck = shuffle([...boss.deck]);

    // Apply starting chip penalty if applicable (e.g., The House)
    const { chips } = get();
    const newChips = boss.startingChipPenalty
      ? chips - boss.startingChipPenalty
      : chips;

    set({
      currentBoss: boss,
      bossActive: true,
      dealerDeck: bossDeck,
      chips: newChips,
      screen: 'bossIntro',
      message: boss.startingChipPenalty
        ? `The House takes ${boss.startingChipPenalty} chips upfront!`
        : '',
    });
  },

  defeatBoss: () => {
    const { currentBoss, chips, runStats } = get();
    if (!currentBoss) return;

    // Grant rewards
    let newChips = chips + currentBoss.chipReward;

    set({
      chips: newChips,
      bossActive: false,
      runStats: {
        ...runStats,
        bossesDefeated: runStats.bossesDefeated + 1,
      },
      message: `Boss defeated! +${currentBoss.chipReward} chips`,
    });

    // Handle bonus rewards
    if (currentBoss.bonusReward === 'maxEdgeBoost') {
      // Shark bonus: +1 Max Edge permanently
      const { maxEdge } = get();
      set({
        maxEdge: maxEdge + 1,
        edge: maxEdge + 1, // Also fill to new max
        message: `Boss reward: +1 Maximum Edge!`,
      });
    } else if (currentBoss.bonusReward === 'victory') {
      // House defeated - complete victory
      get().updateMetaStats(runStats);
      set({ screen: 'victory', message: 'VICTORY! You conquered the Ascent!' });
      return;
    }

    // Show rare card selection if applicable
    if (currentBoss.rareCardRewardCount && currentBoss.rareCardRewardCount > 0) {
      // TODO: Implement rare card selection screen
      // For now, advance to next stage
      get().advanceStage();
    } else {
      // No card reward, just advance
      get().advanceStage();
    }
  },

  applyBossRules: () => {
    // Boss rules are applied during gameplay checks
    // This is a placeholder for explicit rule application
    const { currentBoss } = get();
    if (!currentBoss) return;

    // Boss-specific modifiers are checked in game logic
  },

  // Reset entire game (legacy from Phase 1)
  resetGame: () => {
    get().startNewRun();
  },
}));
