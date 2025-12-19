import type { StarterDeckId } from '@/types/starterDecks';

/**
 * Phase 5: Deck-Themed Visual Elements
 * Visual styling for each deck during gameplay
 */

export interface DeckTheme {
  // Background gradients
  bgGradient: string; // Tailwind gradient classes
  feltGradient: string; // Table felt color

  // Accent colors
  accentColor: string; // Primary accent
  glowColor: string; // Glow effects
  borderColor: string; // Border highlights

  // Trait trigger effect
  traitGlow: string; // Glow when trait triggers

  // Icon/emoji
  icon: string;
}

export const DECK_THEMES: Record<StarterDeckId, DeckTheme> = {
  grinder: {
    bgGradient: 'from-gray-900 via-stone-800 to-gray-900',
    feltGradient: 'from-emerald-900/80 to-emerald-950/80',
    accentColor: 'text-stone-300',
    glowColor: 'shadow-stone-500/50',
    borderColor: 'border-stone-600',
    traitGlow: 'shadow-[0_0_30px_rgba(168,162,158,0.6)]',
    icon: '⚙️',
  },
  highRoller: {
    bgGradient: 'from-purple-950 via-pink-900 to-purple-950',
    feltGradient: 'from-purple-900/80 to-purple-950/80',
    accentColor: 'text-purple-300',
    glowColor: 'shadow-purple-500/50',
    borderColor: 'border-purple-600',
    traitGlow: 'shadow-[0_0_30px_rgba(192,132,252,0.8)]',
    icon: '💎',
  },
  aceHunter: {
    bgGradient: 'from-red-950 via-orange-900 to-red-950',
    feltGradient: 'from-red-900/80 to-red-950/80',
    accentColor: 'text-red-300',
    glowColor: 'shadow-red-500/50',
    borderColor: 'border-red-600',
    traitGlow: 'shadow-[0_0_30px_rgba(252,165,165,0.8)]',
    icon: '🃏',
  },
  gambler: {
    bgGradient: 'from-yellow-950 via-amber-900 to-yellow-950',
    feltGradient: 'from-yellow-900/80 to-yellow-950/80',
    accentColor: 'text-yellow-300',
    glowColor: 'shadow-yellow-500/50',
    borderColor: 'border-yellow-600',
    traitGlow: 'shadow-[0_0_30px_rgba(253,224,71,0.8)]',
    icon: '🎲',
  },
  survivor: {
    bgGradient: 'from-blue-950 via-cyan-900 to-blue-950',
    feltGradient: 'from-blue-900/80 to-blue-950/80',
    accentColor: 'text-blue-300',
    glowColor: 'shadow-blue-500/50',
    borderColor: 'border-blue-600',
    traitGlow: 'shadow-[0_0_30px_rgba(147,197,253,0.8)]',
    icon: '🛡️',
  },
};

/**
 * Get theme for current deck, or default if none
 */
export function getDeckTheme(deckId: StarterDeckId | null): DeckTheme {
  if (!deckId) {
    // Default theme (matches original)
    return {
      bgGradient: 'from-black via-gray-900 to-black',
      feltGradient: 'from-casino-felt to-casino-felt-dark',
      accentColor: 'text-casino-gold',
      glowColor: 'shadow-casino-gold/50',
      borderColor: 'border-casino-gold-dark',
      traitGlow: '',
      icon: '',
    };
  }

  return DECK_THEMES[deckId];
}

/**
 * Get dynamic class name for trait trigger glow effect
 */
export function getTraitGlowClass(
  deckId: StarterDeckId | null,
  isTriggering: boolean
): string {
  if (!deckId || !isTriggering) return '';

  const theme = DECK_THEMES[deckId];
  return `animate-pulse ${theme.traitGlow}`;
}
