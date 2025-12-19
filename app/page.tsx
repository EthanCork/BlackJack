'use client';

import { useGameStore } from '@/store/gameStore';
import TitleScreen from '@/components/TitleScreen';
import Lobby from '@/components/Lobby';
import GameBoard from '@/components/GameBoard';
import StageCompleteScreen from '@/components/StageCompleteScreen';
import GameOverScreen from '@/components/GameOverScreen';
import VictoryScreen from '@/components/VictoryScreen';
import { PowerSelectionScreen } from '@/components/PowerSelectionScreen';
import CardRewardScreen from '@/components/CardRewardScreen';
import DeckShop from '@/components/DeckShop';
import ChallengeScreen from '@/components/ChallengeScreen';
import BossIntro from '@/components/BossIntro';
import type { StarterDeckId } from '@/types/starterDecks';

export default function Home() {
  const { screen, startRunWithDeck } = useGameStore();

  const handleDeckSelection = (deckId: StarterDeckId) => {
    startRunWithDeck(deckId);
  };

  switch (screen) {
    case 'title':
      return <TitleScreen />;
    case 'lobby':
      return <Lobby onSelectDeck={handleDeckSelection} />;
    case 'game':
      return <GameBoard />;
    case 'stageComplete':
      return (
        <>
          <GameBoard />
          <StageCompleteScreen />
        </>
      );
    case 'gameOver':
      return (
        <>
          <GameBoard />
          <GameOverScreen />
        </>
      );
    case 'victory':
      return (
        <>
          <GameBoard />
          <VictoryScreen />
        </>
      );
    case 'powerSelection':
      return <PowerSelectionScreen />;
    case 'cardReward':
      return <CardRewardScreen />;
    case 'deckShop':
      return <DeckShop />;
    case 'challengeScreen':
      return <ChallengeScreen />;
    case 'bossIntro':
      return <BossIntro />;
    default:
      return <TitleScreen />;
  }
}
