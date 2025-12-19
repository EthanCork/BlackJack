import type { Power } from '@/types/powers';
import { useGameStore } from '@/store/gameStore';

interface PowerCardProps {
  power: Power;
  isEquipped?: boolean;
  canUse?: boolean;
  onUse?: () => void;
  onEquip?: () => void;
  onUnequip?: () => void;
  showActions?: boolean;
}

export function PowerCard({
  power,
  isEquipped = false,
  canUse = false,
  onUse,
  onEquip,
  onUnequip,
  showActions = false,
}: PowerCardProps) {
  const edge = useGameStore((state) => state.edge);
  const insufficient = edge < power.cost;

  // Determine tier color
  const tierColors = {
    1: 'border-slate-400',
    2: 'border-blue-400',
    3: 'border-purple-400',
    4: 'border-casino-gold',
  };

  const tierBgColors = {
    1: 'bg-slate-900/50',
    2: 'bg-blue-900/30',
    3: 'bg-purple-900/30',
    4: 'bg-casino-gold/10',
  };

  return (
    <div
      className={`relative border-2 rounded-lg p-3 transition-all ${
        tierColors[power.tier]
      } ${tierBgColors[power.tier]} ${
        isEquipped ? 'ring-2 ring-casino-gold' : ''
      } ${insufficient && showActions ? 'opacity-50' : ''}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{power.icon}</span>
          <div>
            <h3 className="font-bold text-sm">{power.name}</h3>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-casino-gold">⚡ {power.cost}</span>
              <span className="text-gray-400">Tier {power.tier}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-gray-300 mb-2">{power.description}</p>

      {/* Usage limits */}
      <div className="text-xs text-gray-400 mb-2">
        {power.usesPerHand && (
          <div>Per Hand: {power.usesPerHand}</div>
        )}
        {power.usesPerStage && (
          <div>Per Stage: {power.usesPerStage}</div>
        )}
        {power.usesPerRun && (
          <div>Per Run: {power.usesPerRun}</div>
        )}
        {power.passive && (
          <div className="text-yellow-400">⚡ Passive</div>
        )}
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex gap-2 mt-3">
          {onUse && canUse && (
            <button
              onClick={onUse}
              disabled={insufficient}
              className={`flex-1 py-1.5 px-3 rounded font-semibold text-sm transition-all ${
                insufficient
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-casino-gold text-black hover:bg-casino-gold-light'
              }`}
            >
              USE
            </button>
          )}
          {onEquip && !isEquipped && (
            <button
              onClick={onEquip}
              className="flex-1 py-1.5 px-3 rounded font-semibold text-sm bg-green-700 hover:bg-green-600 transition-all"
            >
              EQUIP
            </button>
          )}
          {onUnequip && isEquipped && (
            <button
              onClick={onUnequip}
              className="flex-1 py-1.5 px-3 rounded font-semibold text-sm bg-red-700 hover:bg-red-600 transition-all"
            >
              UNEQUIP
            </button>
          )}
        </div>
      )}

      {/* Equipped badge */}
      {isEquipped && (
        <div className="absolute -top-2 -right-2 bg-casino-gold text-black text-xs font-bold px-2 py-0.5 rounded-full">
          EQUIPPED
        </div>
      )}
    </div>
  );
}
