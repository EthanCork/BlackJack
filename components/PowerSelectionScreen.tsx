import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { PowerCard } from './PowerCard';
import InfoModal from './InfoModal';
import { FIRST_TIME_TIPS } from '@/data/tutorialContent';

export function PowerSelectionScreen() {
  const powerSelection = useGameStore((state) => state.powerSelection);
  const selectPower = useGameStore((state) => state.selectPower);
  const setScreen = useGameStore((state) => state.setScreen);
  const currentStage = useGameStore((state) => state.currentStage);
  const [showGuide, setShowGuide] = useState(false);
  const [showFirstTimeTutorial, setShowFirstTimeTutorial] = useState(false);

  // Show tutorial on first power selection (Stage 1 complete)
  useEffect(() => {
    if (currentStage === 1 && powerSelection.isActive) {
      const hasSeenTutorial = localStorage.getItem('hasSeenBetweenStageTutorial');
      if (!hasSeenTutorial) {
        setShowFirstTimeTutorial(true);
        localStorage.setItem('hasSeenBetweenStageTutorial', 'true');
      }
    }
  }, [currentStage, powerSelection.isActive]);

  if (!powerSelection.isActive) {
    return null;
  }

  const handleSelect = (powerId: string) => {
    // selectPower now handles the flow: Power → Card Reward → Deck Shop
    selectPower(powerId);
  };

  const handleSkip = () => {
    // Skip power selection, go directly to card rewards
    useGameStore.setState({
      powerSelection: { isActive: false, options: [] }
    });
    useGameStore.getState().offerCardReward();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-casino-felt-dark flex items-center justify-center p-8">
      {/* Help Button */}
      <button
        onClick={() => setShowGuide(true)}
        className="absolute top-4 right-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded font-bold text-sm"
      >
        ❓ Between-Stage Guide
      </button>

      {/* First Time Tutorial */}
      <InfoModal
        isOpen={showFirstTimeTutorial}
        onClose={() => setShowFirstTimeTutorial(false)}
        title={FIRST_TIME_TIPS.title}
        sections={FIRST_TIME_TIPS.sections}
      />

      {/* Manual Guide */}
      <InfoModal
        isOpen={showGuide}
        onClose={() => setShowGuide(false)}
        title={FIRST_TIME_TIPS.title}
        sections={FIRST_TIME_TIPS.sections}
      />

      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-casino-gold mb-4">
            Choose Your Power
          </h1>
          <p className="text-xl text-gray-300">
            Select one power to add to your collection
          </p>
        </div>

        {/* Power Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {powerSelection.options.map((power) => (
            <div key={power.id} className="transform hover:scale-105 transition-transform">
              <PowerCard power={power} />
              <button
                onClick={() => handleSelect(power.id)}
                className="w-full mt-3 py-3 px-6 bg-casino-gold hover:bg-casino-gold-light text-black font-bold rounded-lg transition-all"
              >
                SELECT
              </button>
            </div>
          ))}
        </div>

        {/* Skip button */}
        <div className="text-center">
          <button
            onClick={handleSkip}
            className="py-2 px-8 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all"
          >
            Skip (No Power)
          </button>
        </div>
      </div>
    </div>
  );
}
