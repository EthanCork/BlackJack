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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col items-center justify-center p-4 sm:p-8">
      {/* Help Button */}
      <button
        onClick={() => setShowGuide(true)}
        className="absolute top-2 right-2 sm:top-4 sm:right-4 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded font-bold text-xs sm:text-sm touch-manipulation z-10"
      >
        ❓ <span className="hidden sm:inline">Guide</span>
      </button>

      <InfoModal
        isOpen={showGuide}
        onClose={() => setShowGuide(false)}
        title={CHALLENGE_GUIDE.title}
        sections={CHALLENGE_GUIDE.sections}
      />

      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Stage {currentStage} Challenges</h1>
        <p className="text-sm sm:text-base text-gray-400 mb-3 sm:mb-4 px-4">
          These debuffs will be active for this stage
        </p>
        <div className="text-xl sm:text-2xl font-bold text-yellow-400">
          {chips} Chips
        </div>
      </div>

      {/* Challenge Cards - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8 w-full max-w-5xl px-2">
        {activeChallenges.map((challenge) => (
          <div key={challenge.id} className="w-full sm:w-auto">
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
            px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold mb-3 sm:mb-4 text-sm sm:text-base touch-manipulation min-h-[44px]
            ${chips >= removeAllCost
              ? 'bg-red-600 hover:bg-red-500 active:bg-red-700 cursor-pointer'
              : 'bg-gray-700 cursor-not-allowed opacity-50'}
          `}
        >
          Remove All ({removeAllCost} chips - 10% discount!)
        </button>
      )}

      {/* Continue Button */}
      <button
        onClick={handleContinue}
        className="px-6 sm:px-8 py-3 bg-green-600 hover:bg-green-500 active:bg-green-700 rounded-lg text-lg sm:text-xl font-bold transition-colors touch-manipulation min-h-[48px]"
      >
        {isBossStage(currentStage) ? 'Face the Boss' : 'Start Stage'}
      </button>

      {/* Info Text */}
      <div className="text-xs sm:text-sm text-gray-500 mt-3 sm:mt-4 max-w-md text-center px-4">
        You can spend chips to remove challenges, or face them all to save your chips.
      </div>
    </div>
  );
}
