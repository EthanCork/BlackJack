'use client';

import { useGameStore } from '@/store/gameStore';
import { getStage } from '@/lib/stages';
import ChipDisplay from './ChipDisplay';
import { EdgeDisplay } from './EdgeDisplay';
import { getDeckTheme } from '@/lib/deckThemes';
import { STARTER_DECK_POOL } from '@/data/starterDeckPool';

export default function StageHeader() {
  const { currentStage, stageWins, winsNeededForStage, chips, activeDeckId } = useGameStore();

  const stage = getStage(currentStage);
  const progress = (stageWins / stage.winsRequired) * 100;

  // Phase 5: Get deck theme and info
  const theme = getDeckTheme(activeDeckId);
  const activeDeck = activeDeckId ? STARTER_DECK_POOL[activeDeckId] : null;

  return (
    <header className={`w-full py-2 sm:py-4 px-3 sm:px-6 bg-black/60 border-b ${theme.borderColor} backdrop-blur-sm`}>
      <div className="max-w-7xl mx-auto">
        {/* Top Row: Title and Chips */}
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <h1 className={`text-base sm:text-xl md:text-2xl lg:text-3xl font-bold ${theme.accentColor} tracking-wider`}>
              <span className="hidden sm:inline">BLACKJACK ASCENT</span>
              <span className="sm:hidden">BJ ASCENT</span>
            </h1>
            {/* Mobile: Show stage number next to title */}
            <div className={`sm:hidden px-2 py-1 bg-black/40 rounded border ${theme.borderColor}`}>
              <span className={`text-xs font-bold ${theme.accentColor}`}>S{currentStage}</span>
            </div>
            {activeDeck && (
              <div className={`hidden md:flex items-center gap-2 px-3 py-1 bg-black/40 rounded-lg border ${theme.borderColor}`}>
                <span className="text-lg">{theme.icon}</span>
                <span className={`text-sm font-semibold ${theme.accentColor}`}>{activeDeck.name}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
            <EdgeDisplay />
            <ChipDisplay amount={chips} />
            {/* Desktop: Stage indicator */}
            <div className={`hidden sm:block px-2 sm:px-3 py-1 sm:py-2 bg-black/40 rounded-lg border ${theme.borderColor}`}>
              <span className={`text-xs ${theme.accentColor} uppercase block text-center`}>Stage</span>
              <span className={`text-lg sm:text-xl font-bold ${theme.accentColor}`}>{currentStage}</span>
            </div>
          </div>
        </div>

        {/* Bottom Row: Stage Info and Progress */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className={`text-xs sm:text-sm ${theme.accentColor}`}>
                <span className="hidden sm:inline">Stage {currentStage}: </span>
                <span className="font-semibold">{stage.name}</span>
              </span>
              <span className={`text-xs sm:text-sm ${theme.accentColor}`}>
                <span className="hidden sm:inline">Wins: </span>
                <span className="font-bold">{stageWins}/{stage.winsRequired}</span>
              </span>
            </div>

            {/* Progress Bar - themed */}
            <div className={`w-full h-2 sm:h-3 bg-gray-800 rounded-full overflow-hidden border ${theme.borderColor}`}>
              <div
                className={`h-full bg-gradient-to-r ${theme.accentColor.replace('text-', 'from-')}-dark ${theme.accentColor.replace('text-', 'via-')} ${theme.accentColor.replace('text-', 'to-')}-light transition-all duration-500 ease-out shadow-lg ${theme.glowColor}`}
                style={{ width: `${progress}%` }}
              >
                <div className="w-full h-full bg-gradient-to-t from-transparent to-white/20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
