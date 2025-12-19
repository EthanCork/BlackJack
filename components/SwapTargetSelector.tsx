import { useGameStore } from '@/store/gameStore';
import Card from './Card';

export function SwapTargetSelector() {
  const swapTargetOptions = useGameStore((state) => state.swapTargetOptions);
  const executeSwap = useGameStore((state) => state.executeSwap);

  if (!swapTargetOptions || swapTargetOptions.length === 0) {
    return null;
  }

  const playerHand = useGameStore((state) => state.playerHand);

  const handleSelect = (index: number) => {
    executeSwap(index);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-casino-felt-dark border-4 border-casino-gold rounded-xl p-8 max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-casino-gold mb-2">
            🔄 Card Swap
          </h2>
          <p className="text-gray-300">
            Choose which card to replace with a new draw
          </p>
        </div>

        {/* Card Options */}
        <div className="flex gap-4 justify-center mb-6 flex-wrap">
          {playerHand.map((card, index) => (
            <div
              key={index}
              className="transform hover:scale-110 transition-transform cursor-pointer"
              onClick={() => handleSelect(index)}
            >
              <div className="mb-4">
                <Card card={card} />
              </div>
              <button
                onClick={() => handleSelect(index)}
                className="w-full py-2 px-4 bg-casino-gold hover:bg-casino-gold-light text-black font-bold rounded-lg transition-all text-sm"
              >
                SWAP THIS
              </button>
            </div>
          ))}
        </div>

        {/* Hint */}
        <p className="text-center text-sm text-gray-400">
          The selected card will be replaced with a new random card from the deck
        </p>
      </div>
    </div>
  );
}
