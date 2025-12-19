import { useGameStore } from '@/store/gameStore';
import { PowerCard } from './PowerCard';
import { POWER_POOL } from '@/data/powerPool';

export function PowerPanel() {
  const equippedPowers = useGameStore((state) => state.equippedPowers);
  const phase = useGameStore((state) => state.phase);
  const canUsePower = useGameStore((state) => state.canUsePower);
  const usePower = useGameStore((state) => state.usePower);

  // Don't show during certain phases
  if (phase === 'betting' || phase === 'gameOver') {
    return null;
  }

  if (equippedPowers.length === 0) {
    return null;
  }

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 w-64 space-y-3 z-10">
      <div className="text-xs font-bold text-casino-gold text-center mb-2">
        EQUIPPED POWERS
      </div>
      {equippedPowers.map((powerId) => {
        const power = POWER_POOL[powerId];
        if (!power) return null;

        const canUse = canUsePower(powerId);

        return (
          <PowerCard
            key={powerId}
            power={power}
            isEquipped
            canUse={canUse}
            onUse={() => usePower(powerId)}
            showActions
          />
        );
      })}
    </div>
  );
}
