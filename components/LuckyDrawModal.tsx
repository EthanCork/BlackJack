import { useGameStore } from '@/store/gameStore';
import Card from './Card';
import type { Card as CardType } from '@/types/game';

export function LuckyDrawModal() {
  const luckyDrawOptions = useGameStore((state) => state.luckyDrawOptions);
  const selectLuckyCard = useGameStore((state) => state.selectLuckyCard);

  if (!luckyDrawOptions || luckyDrawOptions.length !== 2) {
    return null;
  }

  const handleSelect = (index: 0 | 1) => {
    selectLuckyCard(index);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-casino-felt-dark border-4 border-casino-gold rounded-xl p-8 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-casino-gold mb-2">
            🍀 Lucky Draw
          </h2>
          <p className="text-gray-300">Choose one card to add to your hand</p>
        </div>

        {/* Card Options */}
        <div className="flex gap-8 justify-center mb-6">
          {luckyDrawOptions.map((card: CardType, index: number) => (
            <div
              key={index}
              className="transform hover:scale-110 transition-transform cursor-pointer"
              onClick={() => handleSelect(index as 0 | 1)}
            >
              <div className="mb-4">
                <Card card={card} />
              </div>
              <button
                onClick={() => handleSelect(index as 0 | 1)}
                className="w-full py-2 px-6 bg-casino-gold hover:bg-casino-gold-light text-black font-bold rounded-lg transition-all"
              >
                CHOOSE
              </button>
            </div>
          ))}
        </div>

        {/* Hint */}
        <p className="text-center text-sm text-gray-400">
          Select the card that will help your hand the most
        </p>
      </div>
    </div>
  );
}
