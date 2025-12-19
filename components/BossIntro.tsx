'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import InfoModal from './InfoModal';
import { BOSS_GUIDE } from '@/data/tutorialContent';

export default function BossIntro() {
  const currentBoss = useGameStore((state) => state.currentBoss);
  const currentStage = useGameStore((state) => state.currentStage);
  const [showGuide, setShowGuide] = useState(false);

  if (!currentBoss) {
    return null;
  }

  const handleStartBattle = () => {
    useGameStore.setState({
      bossActive: true,
      screen: 'game',
      phase: 'betting'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-950 to-black text-white flex flex-col items-center justify-center p-8">
      {/* Help Button */}
      <button
        onClick={() => setShowGuide(true)}
        className="absolute top-4 right-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded font-bold text-sm"
      >
        ❓ Guide
      </button>

      <InfoModal
        isOpen={showGuide}
        onClose={() => setShowGuide(false)}
        title={BOSS_GUIDE.title}
        sections={BOSS_GUIDE.sections}
      />

      {/* Stage Label */}
      <div className="text-yellow-400 font-bold text-sm uppercase tracking-wide mb-4">
        Stage {currentStage} Boss
      </div>

      {/* Boss Portrait */}
      <div className="text-9xl mb-6">
        {currentBoss.portrait}
      </div>

      {/* Boss Name */}
      <h1 className="text-5xl font-bold mb-4">
        {currentBoss.name}
      </h1>

      {/* Title */}
      <p className="text-lg text-gray-400 uppercase tracking-wide mb-4">
        {currentBoss.title}
      </p>

      {/* Intro Quote */}
      <p className="text-xl text-gray-300 italic mb-8 max-w-2xl text-center">
        "{currentBoss.introQuote}"
      </p>

      {/* Special Rule */}
      <div className="bg-red-900 border-2 border-red-500 rounded-lg p-6 mb-8 max-w-2xl">
        <div className="text-sm font-bold text-red-400 uppercase tracking-wide mb-2">
          Special Rule
        </div>
        <div className="text-lg">
          {currentBoss.specialRule}
        </div>
      </div>

      {/* Rewards */}
      <div className="bg-yellow-900 border-2 border-yellow-500 rounded-lg p-6 mb-8 max-w-2xl">
        <div className="text-sm font-bold text-yellow-400 uppercase tracking-wide mb-2">
          Victory Rewards
        </div>
        <div className="space-y-1">
          {currentBoss.chipReward > 0 && (
            <div className="text-lg">
              💰 {currentBoss.chipReward} Bonus Chips
            </div>
          )}
          {currentBoss.rareCardRewardCount && (
            <div className="text-lg">
              ✨ Choose 1 Rare Special Card
            </div>
          )}
          {currentBoss.bonusReward === 'maxEdgeBoost' && (
            <div className="text-lg">
              ⚡ +1 Maximum Edge (Permanent)
            </div>
          )}
          {currentBoss.bonusReward === 'victory' && (
            <div className="text-lg">
              🏆 Complete Victory!
            </div>
          )}
        </div>
      </div>

      {/* Start Button */}
      <button
        onClick={handleStartBattle}
        className="px-12 py-4 bg-red-600 hover:bg-red-500 rounded-lg text-2xl font-bold transition-colors animate-pulse"
      >
        Begin Battle
      </button>
    </div>
  );
}
