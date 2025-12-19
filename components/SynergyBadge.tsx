'use client';

interface SynergyBadgeProps {
  type?: 'power' | 'relic' | 'card';
  size?: 'sm' | 'md' | 'lg';
}

export default function SynergyBadge({ type = 'power', size = 'md' }: SynergyBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  const icons = {
    power: '⚡',
    relic: '✨',
    card: '🃏',
  };

  return (
    <div
      className={`
        inline-flex items-center gap-1
        bg-gradient-to-r from-cyan-500 to-blue-500
        text-white font-bold rounded-full
        shadow-lg border border-cyan-300
        animate-pulse
        ${sizeClasses[size]}
      `}
    >
      <span>{icons[type]}</span>
      <span>SYNERGY</span>
    </div>
  );
}

/**
 * Synergy Tooltip - Shows why an item synergizes with the deck
 */
interface SynergyTooltipProps {
  reason: string;
}

export function SynergyTooltip({ reason }: SynergyTooltipProps) {
  return (
    <div className="mt-2 p-2 bg-cyan-900/50 border border-cyan-500 rounded text-cyan-100 text-xs">
      <div className="font-bold mb-1">💡 Deck Synergy</div>
      <div>{reason}</div>
    </div>
  );
}
