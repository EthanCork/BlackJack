import { useGameStore } from '@/store/gameStore';

export function EdgeDisplay() {
  const edge = useGameStore((state) => state.edge);
  const maxEdge = useGameStore((state) => state.maxEdge);

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-semibold text-casino-gold">EDGE</span>
      <div className="flex gap-1">
        {Array.from({ length: maxEdge }).map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all ${
              i < edge
                ? 'bg-casino-gold shadow-[0_0_8px_rgba(212,175,55,0.6)]'
                : 'bg-casino-gold/20 border border-casino-gold/30'
            }`}
            title={`${edge}/${maxEdge} Edge`}
          />
        ))}
      </div>
      <span className="text-xs text-casino-gold/70 ml-1">
        {edge}/{maxEdge}
      </span>
    </div>
  );
}
