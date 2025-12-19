import type { StarterDeck, StarterDeckId } from '@/types/starterDecks';

export const STARTER_DECK_POOL: Record<StarterDeckId, StarterDeck> = {
  grinder: {
    id: 'grinder',
    name: 'The Grinder',
    icon: '📉',
    colorTheme: {
      primary: '#2D5A27', // forest green
      secondary: '#78350F', // brown
    },
    tagline: 'Slow and steady wins the race.',
    description: 'The patient player. Low cards mean you can hit freely. Build to 21 piece by piece.',

    // Starting Resources
    startingChips: 50,
    startingEdge: 5,
    maxEdge: 8,

    // Deck Configuration
    deckSize: 14,
    removedCards: [], // Grinder has specific cards, not removals
    specialCards: [],

    // Starting Equipment
    startingPowerId: null,
    signaturePassive: {
      id: 'slowBurn',
      name: 'Slow Burn',
      description: 'When you hit and don\'t bust, gain +1 chip. Rewards patient, multi-hit hands.',
      icon: '🔥',
    },

    // Meta
    unlockRequirement: null, // Available from start
    dustUnlockCost: 0,
    difficulty: 'beginner',
    playstyleDescription: 'Hit freely on anything under 17. Build hands card by card. Almost never bust early.',
  },

  highRoller: {
    id: 'highRoller',
    name: 'The High Roller',
    icon: '📈',
    colorTheme: {
      primary: '#6B21A8', // royal purple
      secondary: '#FBBF24', // gold
    },
    tagline: 'Go big or go home.',
    description: 'The power player. Your deck is stacked with 10-values. You start strong but have little room to hit.',

    // Starting Resources
    startingChips: 45,
    startingEdge: 5,
    maxEdge: 8,

    // Deck Configuration
    deckSize: 12,
    removedCards: [],
    specialCards: [],

    // Starting Equipment
    startingPowerId: null,
    signaturePassive: {
      id: 'powerStance',
      name: 'Power Stance',
      description: 'Standing on 20 or 21 grants +2 bonus chips. Rewards the natural strength of high cards.',
      icon: '💪',
    },

    // Meta
    unlockRequirement: null, // Available from start
    dustUnlockCost: 0,
    difficulty: 'intermediate',
    playstyleDescription: 'Rarely hit - you\'ll bust. Push for natural 20s. High blackjack rate.',
  },

  aceHunter: {
    id: 'aceHunter',
    name: 'The Ace Master',
    icon: '🂡',
    colorTheme: {
      primary: '#1F2937', // gunmetal
      secondary: '#9CA3AF', // silver
    },
    tagline: 'Flexibility is the ultimate power.',
    description: 'The flexible player. Aces are your foundation. Soft hands everywhere. You adapt to any situation.',

    // Starting Resources
    startingChips: 50,
    startingEdge: 5,
    maxEdge: 8,

    // Deck Configuration
    deckSize: 12,
    removedCards: [],
    specialCards: [],

    // Starting Equipment
    startingPowerId: null,
    signaturePassive: {
      id: 'aceInTheHole',
      name: 'Ace in the Hole',
      description: 'Blackjacks pay 2:1 instead of 3:2 (33% bonus). Your high blackjack rate is rewarded.',
      icon: '🂡',
    },

    // Meta
    unlockRequirement: 'Get 50 lifetime blackjacks',
    dustUnlockCost: 500,
    difficulty: 'advanced',
    playstyleDescription: 'Soft hands constantly. Hit aggressively on soft totals. Chase blackjacks.',
  },

  gambler: {
    id: 'gambler',
    name: 'The Gambler',
    icon: '🎲',
    colorTheme: {
      primary: '#DC2626', // bold red
      secondary: '#FBBF24', // gold
    },
    tagline: 'Fortune favors the bold.',
    description: 'The risk-taker. A chaotic mix designed for big swings. Special cards add unpredictability.',

    // Starting Resources
    startingChips: 40,
    startingEdge: 6,
    maxEdge: 8,

    // Deck Configuration
    deckSize: 14,
    removedCards: [],
    specialCards: [
      { type: 'wild', count: 2 },
      { type: 'golden', count: 2 },
    ],

    // Starting Equipment
    startingPowerId: null,
    signaturePassive: {
      id: 'allOrNothing',
      name: 'All or Nothing',
      description: 'Double downs pay 3:1 instead of 2:1. Losing a double costs extra 25% of bet.',
      icon: '💰',
    },

    // Meta
    unlockRequirement: 'Win 1 run',
    dustUnlockCost: 200,
    difficulty: 'intermediate',
    playstyleDescription: 'Wild Cards = ultimate flexibility. Golden Cards = economy spikes. High variance, big swings.',
  },

  survivor: {
    id: 'survivor',
    name: 'The Foundation',
    icon: '⚖️',
    colorTheme: {
      primary: '#2563EB', // clean blue
      secondary: '#DBEAFE', // light blue
    },
    tagline: 'Balance in all things.',
    description: 'The balanced player. A bit of everything. No extreme strengths, no extreme weaknesses.',

    // Starting Resources
    startingChips: 55,
    startingEdge: 5,
    maxEdge: 8,

    // Deck Configuration
    deckSize: 16,
    removedCards: [],
    specialCards: [],

    // Starting Equipment
    startingPowerId: null,
    signaturePassive: {
      id: 'adaptable',
      name: 'Adaptable',
      description: 'After each stage clear, may swap one card in deck for any standard card. Slowly shape your deck\'s identity.',
      icon: '🔄',
    },

    // Meta
    unlockRequirement: null, // Available from start
    dustUnlockCost: 0,
    difficulty: 'beginner',
    playstyleDescription: 'Play standard blackjack strategy. No gimmicks, just solid fundamentals. Adapts to whatever you add.',
  },
};

// Helper functions
export function getStarterDeck(id: StarterDeckId): StarterDeck {
  return STARTER_DECK_POOL[id];
}

export function getAllStarterDecks(): StarterDeck[] {
  return Object.values(STARTER_DECK_POOL);
}

export function getUnlockedDecks(unlockedIds: StarterDeckId[]): StarterDeck[] {
  return getAllStarterDecks().filter(
    deck => deck.unlockRequirement === null || unlockedIds.includes(deck.id)
  );
}

export function getStartingDecks(): StarterDeck[] {
  return getAllStarterDecks().filter(deck => deck.unlockRequirement === null);
}
