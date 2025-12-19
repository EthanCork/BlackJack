'use client';

import { useGameStore } from '@/store/gameStore';

export default function TitleScreen() {
  const setScreen = useGameStore((state) => state.setScreen);

  const handleNewRun = () => {
    setScreen('lobby');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex flex-col items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 text-6xl animate-pulse">♠</div>
        <div className="absolute top-20 right-20 text-6xl animate-pulse delay-150">♥</div>
        <div className="absolute bottom-20 left-1/4 text-6xl animate-pulse delay-300">♣</div>
        <div className="absolute bottom-10 right-1/3 text-6xl animate-pulse delay-500">♦</div>
      </div>

      {/* Logo/Title */}
      <div className="relative z-10 text-center mb-12">
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-casino-gold mb-4 tracking-wider drop-shadow-2xl">
          BLACKJACK
        </h1>
        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-casino-gold-light via-casino-gold to-casino-gold-dark bg-clip-text text-transparent animate-shimmer">
          ASCENT
        </h2>
        <p className="mt-6 text-lg sm:text-xl text-gray-400 max-w-md mx-auto">
          A roguelite card game. Beat 8 stages to win.
        </p>
      </div>

      {/* Subtitle / Tagline */}
      <div className="relative z-10 mb-12 text-center">
        <div className="inline-block px-6 py-2 bg-casino-gold/10 border border-casino-gold-dark rounded-full">
          <span className="text-casino-gold-light text-sm uppercase tracking-widest">
            Phase 5: Starter Decks • Meta-Progression
          </span>
        </div>
      </div>

      {/* Main Menu Buttons */}
      <div className="relative z-10 flex flex-col gap-4 w-full max-w-md">
        <button
          onClick={handleNewRun}
          className="w-full py-6 px-8 bg-gradient-to-r from-casino-gold to-casino-gold-light hover:from-casino-gold-light hover:to-casino-gold text-black font-bold text-2xl rounded-lg shadow-2xl transform hover:scale-105 transition-all duration-200 active:scale-95"
        >
          NEW RUN
        </button>

        <button
          onClick={() => {
            // TODO: Implement How to Play modal
            alert('How to Play:\n\n• Win hands to progress through stages\n• Each stage requires a certain number of wins\n• Double Down to double your bet (2-card hands only)\n• Split matching pairs into two hands\n• Clear all 8 stages to victory!\n\nGood luck!');
          }}
          className="w-full py-4 px-8 bg-gray-800 hover:bg-gray-700 text-casino-gold-light font-bold text-lg rounded-lg border-2 border-casino-gold-dark transition-all duration-200 hover:border-casino-gold"
        >
          HOW TO PLAY
        </button>
      </div>

      {/* Version Info */}
      <div className="absolute bottom-4 right-4 text-gray-600 text-sm">
        v0.2.0 - Phase 2
      </div>
    </div>
  );
}
