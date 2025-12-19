'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { calculateRemoveAllDiscount } from '@/data/challengePool';
import { isBossStage } from '@/data/bossPool';
import ChallengeCard from './ChallengeCard';
import InfoModal from './InfoModal';
import { CHALLENGE_GUIDE } from '@/data/tutorialContent';

export default function ChallengeScreen() {
  const chips = useGameStore((state) => state.chips);
  const activeChallenges = useGameStore((state) => state.activeChallenges);
  const currentStage = useGameStore((state) => state.currentStage);
  const removeChallenge = useGameStore((state) => state.removeChallenge);
  const initializeBoss = useGameStore((state) => state.initializeBoss);
  const [showGuide, setShowGuide] = useState(false);

  const removeAllCost = calculateRemoveAllDiscount(activeChallenges);

  const handleRemove = (challengeId: string) => {
    const challenge = activeChallenges.find(c => c.id === challengeId);
    if (challenge && chips >= challenge.removeCost) {
      removeChallenge(challengeId);
    }
  };

  const handleRemoveAll = () => {
    if (chips >= removeAllCost) {
      activeChallenges.forEach(c => removeChallenge(c.id));
    }
  };

  const handleContinue = () => {
    // Check if this is a boss stage
    if (isBossStage(currentStage)) {
      initializeBoss();
    } else {
      // Go straight to game
      useGameStore.setState({ screen: 'game', phase: 'betting' });
    }
  };

  // No challenges? Auto-continue
  if (activeChallenges.length === 0) {
    handleContinue();
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col items-center justify-center p-8">
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
        title={CHALLENGE_GUIDE.title}
        sections={CHALLENGE_GUIDE.sections}
      />

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Stage {currentStage} Challenges</h1>
        <p className="text-gray-400 mb-4">
          These debuffs will be active for this stage
        </p>
        <div className="text-2xl font-bold text-yellow-400">
          {chips} Chips
        </div>
      </div>

      {/* Challenge Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8 max-w-5xl">
        {activeChallenges.map((challenge) => (
          <div key={challenge.id} className="w-64">
            <ChallengeCard
              challenge={challenge}
              onRemove={() => handleRemove(challenge.id)}
              canRemove={chips >= challenge.removeCost}
              showRemoveCost={true}
            />
          </div>
        ))}
      </div>

      {/* Remove All Option */}
      {activeChallenges.length > 1 && (
        <button
          onClick={handleRemoveAll}
          disabled={chips < removeAllCost}
          className={`
            px-6 py-3 rounded-lg font-bold mb-4
            ${chips >= removeAllCost
              ? 'bg-red-600 hover:bg-red-500 cursor-pointer'
              : 'bg-gray-700 cursor-not-allowed opacity-50'}
          `}
        >
          Remove All ({removeAllCost} chips - 10% discount!)
        </button>
      )}

      {/* Continue Button */}
      <button
        onClick={handleContinue}
        className="px-8 py-3 bg-green-600 hover:bg-green-500 rounded-lg text-xl font-bold transition-colors"
      >
        {isBossStage(currentStage) ? 'Face the Boss' : 'Start Stage'}
      </button>

      {/* Info Text */}
      <div className="text-xs text-gray-500 mt-4 max-w-md text-center">
        You can spend chips to remove challenges, or face them all to save your chips.
      </div>
    </div>
  );
}
