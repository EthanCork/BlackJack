'use client';

import { useGameStore } from '@/store/gameStore';
import Hand from './Hand';
import StageHeader from './StageHeader';
import BetControls from './BetControls';
import ActionButtons from './ActionButtons';
import GameStatus from './GameStatus';
import SplitHands from './SplitHands';
import { PowerPanel } from './PowerPanel';
import { LuckyDrawModal } from './LuckyDrawModal';
import { SwapTargetSelector } from './SwapTargetSelector';
import { getDeckTheme } from '@/lib/deckThemes';

export default function GameBoard() {
  const {
    playerHand,
    dealerHand,
    currentBet,
    phase,
    outcome,
    splitState,
    activeDeckId,
  } = useGameStore();

  const showBetControls = phase === 'betting';
  const showActionButtons = phase === 'playerTurn' || phase === 'resolution';
  const isSplitActive = splitState?.isActive;

  // Phase 5: Get theme for active deck
  const theme = getDeckTheme(activeDeckId);

  return (
    <div className={`min-h-screen bg-gradient-to-b ${theme.bgGradient} flex flex-col pb-32 lg:pb-0`}>
      {/* Header with Stage Progress */}
      <StageHeader />

      {/* Main Game Area */}
      <main className="flex-1 flex flex-col items-center justify-between py-4 sm:py-8 px-2 sm:px-4 gap-4 sm:gap-8 mb-4 lg:mb-0">
        {/* Dealer Area */}
        <div className="w-full max-w-5xl">
          <Hand
            cards={dealerHand}
            label="DEALER"
            showValue={phase !== 'betting' && phase !== 'dealing' && phase !== 'playerTurn'}
            hideHoleCard={phase === 'playerTurn' || phase === 'dealing'}
            outcome={outcome === 'lose' ? 'win' : outcome === 'win' || outcome === 'blackjack' ? 'lose' : null}
          />
        </div>

        {/* Center Table Area */}
        <div className="w-full max-w-5xl flex flex-col items-center gap-3 sm:gap-6">
          {/* Felt Table Background - themed */}
          <div className={`w-full rounded-2xl sm:rounded-3xl bg-gradient-to-br ${theme.feltGradient} border-2 sm:border-4 ${theme.borderColor} p-4 sm:p-8 shadow-2xl ${theme.glowColor}`}>
            <div className="flex flex-col items-center gap-3 sm:gap-4">
              {/* Current Bet Display (during play) */}
              {currentBet > 0 && phase !== 'betting' && !isSplitActive && (
                <div className={`px-4 sm:px-8 py-2 sm:py-4 bg-black/40 rounded-full border-2 ${theme.borderColor}`}>
                  <div className="text-center">
                    <span className={`text-xs sm:text-sm ${theme.accentColor} uppercase block`}>Bet</span>
                    <span className={`text-3xl font-bold ${theme.accentColor}`}>{currentBet}</span>
                  </div>
                </div>
              )}

              {/* Game Status Message */}
              <GameStatus />
            </div>
          </div>
        </div>

        {/* Player Area - Normal or Split */}
        <div className="w-full max-w-5xl">
          {isSplitActive ? (
            <SplitHands />
          ) : (
            <Hand
              cards={playerHand}
              label="YOU"
              showValue={playerHand.length > 0}
              outcome={outcome}
            />
          )}
        </div>
      </main>

      {/* Action Area - themed */}
      <div className={`w-full py-6 px-4 bg-black/60 border-t ${theme.borderColor}`}>
        <div className="max-w-5xl mx-auto flex justify-center">
          {showBetControls && <BetControls />}
          {showActionButtons && <ActionButtons />}
        </div>
      </div>

      {/* Power System Components */}
      <PowerPanel />
      <LuckyDrawModal />
      <SwapTargetSelector />
    </div>
  );
}
