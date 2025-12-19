'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { ALL_SPECIAL_CARDS, type SpecialCardDef } from '@/data/specialCardPool';
import type { Card, Rank, Suit } from '@/types/game';
import DeckView from './DeckView';

/**
 * UNIFIED DECK SHOP
 * One shop for both standard and special cards
 * Replaces the old relic + special card system
 */

const REROLL_COST = 4;
const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];

// Standard card pricing by rank
const STANDARD_CARD_PRICES: Record<Rank, number> = {
  '2': 3, '3': 3, '4': 3, '5': 3, '6': 3,  // Low cards
  '7': 4, '8': 4, '9': 4,                    // Mid cards
  '10': 5, 'J': 5, 'Q': 5, 'K': 5,          // High cards
  'A': 8,                                     // Ace
};

interface ShopCard {
  type: 'standard' | 'special';
  card?: Card;  // For standard cards
  specialDef?: SpecialCardDef; // For special cards
  cost: number;
  sold: boolean;
}

// Shop generation with weighting
function generateShop(unlockedSpecialCards: string[]): ShopCard[] {
  const shop: ShopCard[] = [];
  const numCards = 6;

  // Get unlocked special cards only
  const availableSpecials = Object.values(ALL_SPECIAL_CARDS).filter(
    card => card.startUnlocked || unlockedSpecialCards.includes(card.id)
  );

  // Target: ~70% standard, ~30% special
  const numSpecials = Math.min(2, availableSpecials.length > 0 ? 1 + Math.floor(Math.random() * 2) : 0);
  const numStandard = numCards - numSpecials;

  // Add standard cards
  const usedStandard = new Set<string>();
  for (let i = 0; i < numStandard; i++) {
    const rank = getWeightedRank();
    const suit = SUITS[Math.floor(Math.random() * SUITS.length)];
    const key = `${rank}-${suit}`;

    // Avoid exact duplicates
    if (!usedStandard.has(key)) {
      usedStandard.add(key);
      shop.push({
        type: 'standard',
        card: createStandardCard(rank, suit),
        cost: STANDARD_CARD_PRICES[rank],
        sold: false,
      });
    }
  }

  // Add special cards
  const usedSpecials = new Set<string>();
  for (let i = 0; i < numSpecials; i++) {
    if (availableSpecials.length === 0) break;

    let special: SpecialCardDef;
    let attempts = 0;
    do {
      special = availableSpecials[Math.floor(Math.random() * availableSpecials.length)];
      attempts++;
    } while (usedSpecials.has(special.id) && attempts < 10);

    if (!usedSpecials.has(special.id)) {
      usedSpecials.add(special.id);
      shop.push({
        type: 'special',
        specialDef: special,
        cost: special.shopCost,
        sold: false,
      });
    }
  }

  // Shuffle shop
  return shop.sort(() => Math.random() - 0.5);
}

function getWeightedRank(): Rank {
  const roll = Math.random() * 100;

  if (roll < 30) {
    // Low cards (30%): 2-6
    const lowRanks: Rank[] = ['2', '3', '4', '5', '6'];
    return lowRanks[Math.floor(Math.random() * lowRanks.length)];
  } else if (roll < 55) {
    // Mid cards (25%): 7-9
    const midRanks: Rank[] = ['7', '8', '9'];
    return midRanks[Math.floor(Math.random() * midRanks.length)];
  } else if (roll < 80) {
    // High cards (25%): 10-K
    const highRanks: Rank[] = ['10', 'J', 'Q', 'K'];
    return highRanks[Math.floor(Math.random() * highRanks.length)];
  } else {
    // Ace (20%)
    return 'A';
  }
}

function createStandardCard(rank: Rank, suit: Suit): Card {
  let value: number;
  if (rank === 'A') {
    value = 11;
  } else if (['J', 'Q', 'K'].includes(rank)) {
    value = 10;
  } else {
    value = parseInt(rank);
  }

  return {
    suit,
    rank,
    value,
    faceUp: true,
  };
}

export default function DeckShop() {
  const chips = useGameStore((state) => state.chips);
  const deck = useGameStore((state) => state.deck);
  const unlockedSpecialCards = useGameStore((state) => state.unlockedSpecialCards);
  const currentStage = useGameStore((state) => state.currentStage);

  const [shop, setShop] = useState<ShopCard[]>(() => generateShop(unlockedSpecialCards));
  const [selectedCard, setSelectedCard] = useState<ShopCard | null>(null);

  const handlePurchase = (index: number) => {
    const item = shop[index];
    if (item.sold || chips < item.cost) return;

    // Add card to deck
    let newCard: Card;

    if (item.type === 'standard' && item.card) {
      newCard = { ...item.card };
    } else if (item.type === 'special' && item.specialDef) {
      // Create special card instance
      newCard = createSpecialCardInstance(item.specialDef);
    } else {
      return;
    }

    // Update game state
    const newDeck = [...deck, newCard];
    const newChips = chips - item.cost;
    const runStats = useGameStore.getState().runStats;

    // Track special cards in run stats
    const newStats = { ...runStats, cardsAdded: runStats.cardsAdded + 1 };
    if (item.type === 'special' && item.specialDef) {
      newStats.specialCardsCollected = runStats.specialCardsCollected + 1;
      newStats.specialCardNames = [...runStats.specialCardNames, item.specialDef.name];
    }

    useGameStore.setState({
      deck: newDeck,
      chips: newChips,
      runStats: newStats,
      message: `Purchased ${item.type === 'special' ? item.specialDef!.displayName : `${item.card!.rank}${getSuitSymbol(item.card!.suit)}`}`,
    });

    // Mark as sold
    const newShop = [...shop];
    newShop[index] = { ...item, sold: true };
    setShop(newShop);
    setSelectedCard(null);
  };

  const handleReroll = () => {
    if (chips < REROLL_COST) return;

    useGameStore.setState({ chips: chips - REROLL_COST });
    setShop(generateShop(unlockedSpecialCards));
    setSelectedCard(null);
  };

  const handleContinue = () => {
    // Generate challenges and move to next screen
    const generateChallenges = useGameStore.getState().generateChallenges;
    generateChallenges();
    useGameStore.setState({ screen: 'challengeScreen' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Deck Shop</h1>
        <p className="text-gray-400">Stage {currentStage}</p>
        <div className="text-3xl font-bold text-yellow-400 mt-4">
          💰 {chips} Chips
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Shop Cards */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Available Cards</h2>
            <button
              onClick={handleReroll}
              disabled={chips < REROLL_COST}
              className={`px-4 py-2 rounded-lg font-bold ${
                chips >= REROLL_COST
                  ? 'bg-purple-600 hover:bg-purple-500'
                  : 'bg-gray-700 cursor-not-allowed opacity-50'
              }`}
            >
              🔄 Reroll ({REROLL_COST} chips)
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {shop.map((item, index) => (
              <ShopCardDisplay
                key={index}
                item={item}
                canAfford={chips >= item.cost}
                onSelect={() => setSelectedCard(item)}
                onPurchase={() => handlePurchase(index)}
              />
            ))}
          </div>
        </div>

        {/* Your Deck */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Your Deck ({deck.length} cards)</h2>
          <DeckView deck={deck} />
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <button
            onClick={handleContinue}
            className="px-8 py-4 bg-green-600 hover:bg-green-500 rounded-lg text-xl font-bold"
          >
            Continue →
          </button>
        </div>
      </div>

      {/* Card Detail Modal */}
      {selectedCard && (
        <CardDetailModal
          item={selectedCard}
          canAfford={chips >= selectedCard.cost}
          onClose={() => setSelectedCard(null)}
          onPurchase={() => {
            const index = shop.indexOf(selectedCard);
            if (index !== -1) handlePurchase(index);
          }}
        />
      )}
    </div>
  );
}

function ShopCardDisplay({
  item,
  canAfford,
  onSelect,
  onPurchase
}: {
  item: ShopCard;
  canAfford: boolean;
  onSelect: () => void;
  onPurchase: () => void;
}) {
  if (item.sold) {
    return (
      <div className="bg-gray-800 border-2 border-gray-600 rounded-lg p-4 opacity-50">
        <div className="text-center text-gray-500 text-xl font-bold">
          SOLD ✓
        </div>
      </div>
    );
  }

  const rarityColors = {
    common: 'border-gray-400 bg-gray-800',
    rare: 'border-blue-500 bg-blue-900/30',
    legendary: 'border-yellow-500 bg-yellow-900/30',
  };

  const borderColor = item.type === 'special'
    ? rarityColors[item.specialDef!.rarity]
    : 'border-green-600 bg-green-900/20';

  return (
    <div
      onClick={onSelect}
      className={`
        border-2 rounded-lg p-4 cursor-pointer transition-all hover:scale-105
        ${canAfford ? borderColor : 'border-gray-600 bg-gray-800 opacity-60'}
      `}
    >
      {/* Card Content */}
      <div className="text-center mb-3">
        {item.type === 'standard' && item.card && (
          <>
            <div className="text-5xl mb-2">{getSuitSymbol(item.card.suit)}</div>
            <div className="text-2xl font-bold">{item.card.rank}</div>
            <div className="text-sm text-gray-400">Standard Card</div>
          </>
        )}

        {item.type === 'special' && item.specialDef && (
          <>
            <div className="text-5xl mb-2">{item.specialDef.icon}</div>
            <div className="text-lg font-bold">{item.specialDef.displayName}</div>
            <div className="text-xs text-gray-400 uppercase">{item.specialDef.rarity}</div>
          </>
        )}
      </div>

      {/* Price */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPurchase();
        }}
        disabled={!canAfford}
        className={`
          w-full py-2 rounded font-bold
          ${canAfford
            ? 'bg-yellow-600 hover:bg-yellow-500'
            : 'bg-gray-700 cursor-not-allowed'}
        `}
      >
        {item.cost} chips
      </button>
    </div>
  );
}

function CardDetailModal({
  item,
  canAfford,
  onClose,
  onPurchase
}: {
  item: ShopCard;
  canAfford: boolean;
  onClose: () => void;
  onPurchase: () => void;
}) {
  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 border-2 border-yellow-500 rounded-lg p-8 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {item.type === 'standard' && item.card && (
          <>
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">{getSuitSymbol(item.card.suit)}</div>
              <h2 className="text-3xl font-bold mb-2">{item.card.rank} of {item.card.suit}</h2>
              <div className="text-xl text-gray-400">Value: {item.card.value}</div>
            </div>
            <p className="text-gray-300 mb-6">
              {getCardDescription(item.card)}
            </p>
          </>
        )}

        {item.type === 'special' && item.specialDef && (
          <>
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">{item.specialDef.icon}</div>
              <h2 className="text-3xl font-bold mb-2">{item.specialDef.name}</h2>
              <div className={`text-sm uppercase font-bold mb-2 ${
                item.specialDef.rarity === 'legendary' ? 'text-yellow-400' :
                item.specialDef.rarity === 'rare' ? 'text-blue-400' :
                'text-gray-400'
              }`}>
                {item.specialDef.rarity}
              </div>
            </div>
            <p className="text-gray-300 mb-6">
              {item.specialDef.effectDescription}
            </p>
          </>
        )}

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold"
          >
            Back
          </button>
          <button
            onClick={onPurchase}
            disabled={!canAfford}
            className={`
              flex-1 py-3 rounded-lg font-bold
              ${canAfford
                ? 'bg-yellow-600 hover:bg-yellow-500'
                : 'bg-gray-700 cursor-not-allowed opacity-50'}
            `}
          >
            Buy - {item.cost} chips
          </button>
        </div>
      </div>
    </div>
  );
}

function getSuitSymbol(suit: Suit): string {
  const symbols: Record<Suit, string> = {
    hearts: '♥️',
    diamonds: '♦️',
    clubs: '♣️',
    spades: '♠️',
  };
  return symbols[suit];
}

function getCardDescription(card: Card): string {
  const value = card.value;
  const rank = card.rank;

  if (rank === 'A') {
    return 'Versatile: Count as 1 or 11. Essential for Blackjacks.';
  }
  if (value === 10) {
    return 'High-value card: Great for hitting 20-21.';
  }
  if (value <= 6) {
    return 'Safe card: Hit without much bust risk.';
  }
  return 'Mid-value card: Balanced utility.';
}

function createSpecialCardInstance(def: SpecialCardDef): Card {
  // Create a card representation of the special card
  // The actual special behavior will be handled by the special field
  let rank: Rank = '7'; // Default
  let value = 7;

  if (typeof def.baseValue === 'number') {
    value = def.baseValue;
    if (value === 11) rank = 'A';
    else if (value === 10) rank = '10';
    else if (value >= 2 && value <= 9) rank = value.toString() as Rank;
  }

  return {
    suit: 'spades',
    rank,
    value,
    faceUp: true,
    special: def.id as any, // Store the special card ID
  };
}
