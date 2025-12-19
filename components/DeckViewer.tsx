'use client';

import type { StarterDeck } from '@/types/starterDecks';

interface DeckViewerProps {
  deck: StarterDeck;
  onBack: () => void;
}

export default function DeckViewer({ deck, onBack }: DeckViewerProps) {
  // Generate visual representation of starting deck based on deck definition
  const generateDeckCards = () => {
    const cards: { rank: string; suit: string; special?: string }[] = [];

    // Based on the design doc, each deck has specific cards
    const deckConfigs: Record<string, { rank: string; count: number; special?: string }[]> = {
      grinder: [
        { rank: '2', count: 2 },
        { rank: '3', count: 2 },
        { rank: '4', count: 2 },
        { rank: '5', count: 2 },
        { rank: '6', count: 2 },
        { rank: '7', count: 2 },
        { rank: 'A', count: 2 },
      ],
      highRoller: [
        { rank: '9', count: 2 },
        { rank: '10', count: 2 },
        { rank: 'J', count: 2 },
        { rank: 'Q', count: 2 },
        { rank: 'K', count: 2 },
        { rank: 'A', count: 2 },
      ],
      aceHunter: [
        { rank: 'A', count: 4 },
        { rank: '5', count: 2 },
        { rank: '6', count: 2 },
        { rank: '10', count: 2 },
        { rank: 'K', count: 2 },
      ],
      gambler: [
        { rank: '2', count: 1 },
        { rank: '7', count: 2 },
        { rank: '8', count: 2 },
        { rank: '10', count: 2 },
        { rank: 'J', count: 1 },
        { rank: 'A', count: 2 },
        { rank: 'Wild', count: 2, special: 'wild' },
        { rank: 'Gold', count: 2, special: 'golden' },
      ],
      survivor: [
        { rank: '3', count: 2 },
        { rank: '5', count: 2 },
        { rank: '7', count: 2 },
        { rank: '9', count: 2 },
        { rank: '10', count: 2 },
        { rank: 'Q', count: 2 },
        { rank: 'A', count: 2 },
        { rank: '6', count: 2 },
      ],
    };

    const config = deckConfigs[deck.id] || [];
    const suits = ['♠', '♥', '♦', '♣'];
    let suitIndex = 0;

    config.forEach(({ rank, count, special }) => {
      for (let i = 0; i < count; i++) {
        cards.push({
          rank,
          suit: suits[suitIndex % 4],
          special,
        });
        suitIndex++;
      }
    });

    return cards;
  };

  const cards = generateDeckCards();

  // Count breakdown
  const countBreakdown: Record<string, number> = {};
  cards.forEach(card => {
    if (!card.special) {
      countBreakdown[card.rank] = (countBreakdown[card.rank] || 0) + 1;
    }
  });

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50 p-8 overflow-y-auto">
      <div className="max-w-5xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-2">
            {deck.name} - Full Deck ({deck.deckSize} cards)
          </h2>
          <p className="text-gray-400">Every card in your starting deck</p>
        </div>

        {/* Card Grid */}
        <div
          className="bg-black/60 rounded-xl p-8 mb-6"
          style={{ border: `2px solid ${deck.colorTheme.primary}` }}
        >
          <div className="grid grid-cols-7 gap-3 mb-6">
            {cards.map((card, index) => (
              <div
                key={index}
                className={`
                  aspect-[2.5/3.5] rounded-lg flex flex-col items-center justify-center
                  font-bold text-2xl relative
                  ${card.special === 'wild' && 'bg-gradient-to-br from-purple-600 to-pink-600'}
                  ${card.special === 'golden' && 'bg-gradient-to-br from-yellow-600 to-orange-600'}
                  ${!card.special && (card.suit === '♥' || card.suit === '♦') && 'bg-white text-red-600'}
                  ${!card.special && (card.suit === '♠' || card.suit === '♣') && 'bg-white text-black'}
                `}
              >
                {card.special === 'wild' && (
                  <div className="text-white text-center">
                    <div className="text-3xl">?</div>
                    <div className="text-xs">Wild</div>
                  </div>
                )}
                {card.special === 'golden' && (
                  <div className="text-white text-center">
                    <div className="text-3xl">10</div>
                    <div className="text-xs">Gold</div>
                  </div>
                )}
                {!card.special && (
                  <>
                    <div className="absolute top-1 left-1 text-sm">
                      {card.rank}
                      <div className="text-xs">{card.suit}</div>
                    </div>
                    <div>{card.rank}</div>
                    <div className="text-4xl">{card.suit}</div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Breakdown */}
          <div className="border-t border-gray-700 pt-6">
            <h3 className="font-bold mb-4 text-center text-xl">BREAKDOWN</h3>
            <div className="grid grid-cols-4 gap-4 text-sm">
              {Object.entries(countBreakdown)
                .sort((a, b) => {
                  const order = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
                  return order.indexOf(a[0]) - order.indexOf(b[0]);
                })
                .map(([rank, count]) => (
                  <div key={rank} className="flex items-center gap-2">
                    <span className="font-bold">{rank}s:</span>
                    <div className="flex gap-1">
                      {Array(count).fill(0).map((_, i) => (
                        <div key={i} className="w-3 h-4 bg-blue-500 rounded"></div>
                      ))}
                    </div>
                    <span className="text-gray-400">({count})</span>
                  </div>
                ))}

              {cards.some(c => c.special === 'wild') && (
                <div className="flex items-center gap-2">
                  <span className="font-bold">Wild:</span>
                  <div className="flex gap-1">
                    {Array(cards.filter(c => c.special === 'wild').length).fill(0).map((_, i) => (
                      <div key={i} className="w-3 h-4 bg-purple-500 rounded"></div>
                    ))}
                  </div>
                  <span className="text-gray-400">({cards.filter(c => c.special === 'wild').length})</span>
                </div>
              )}

              {cards.some(c => c.special === 'golden') && (
                <div className="flex items-center gap-2">
                  <span className="font-bold">Golden:</span>
                  <div className="flex gap-1">
                    {Array(cards.filter(c => c.special === 'golden').length).fill(0).map((_, i) => (
                      <div key={i} className="w-3 h-4 bg-yellow-500 rounded"></div>
                    ))}
                  </div>
                  <span className="text-gray-400">({cards.filter(c => c.special === 'golden').length})</span>
                </div>
              )}
            </div>

            {/* Missing Cards */}
            <div className="mt-6 text-center text-sm text-gray-400">
              {deck.id === 'grinder' && 'No 8s, 9s, 10s, Jacks, Queens, or Kings'}
              {deck.id === 'highRoller' && 'No 2s, 3s, 4s, 5s, 6s, 7s, or 8s'}
              {deck.id === 'aceHunter' && 'No 2s, 3s, 4s, 7s, 8s, 9s, Jacks, or Queens'}
              {deck.id === 'gambler' && 'Mix of standard and special cards'}
              {deck.id === 'survivor' && 'Balanced distribution - no significant gaps'}
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center">
          <button
            onClick={onBack}
            className="px-8 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold transition-colors"
          >
            ← Back to Preview
          </button>
        </div>
      </div>
    </div>
  );
}
