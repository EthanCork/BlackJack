import { useGameStore } from '@/store/gameStore';

export function EdgeDisplay() {
  const edge = useGameStore((state) => state.edge);
  const maxEdge = useGameStore((state) => state.maxEdge);
  const stageWins = useGameStore((state) => state.stageWins);
  const winsNeededForStage = useGameStore((state) => state.winsNeededForStage());
  const runStats = useGameStore((state) => state.runStats);

  // Show stage progress: just show wins needed, filled in as we win
  // We'll show exactly winsNeeded dots - green for wins, gray for remaining
  const totalDots = winsNeededForStage;
  const wins = stageWins;

  return (
    <div className="flex flex-col gap-1">
      {/* Edge System (Powers) */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-casino-gold">EDGE</span>
        <div className="flex gap-1">
          {Array.from({ length: maxEdge }).map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i < edge
                  ? 'bg-casino-gold shadow-[0_0_6px_rgba(212,175,55,0.6)]'
                  : 'bg-casino-gold/20 border border-casino-gold/30'
              }`}
              title={`${edge}/${maxEdge} Edge`}
            />
          ))}
        </div>
        <span className="text-[10px] text-casino-gold/70">
          {edge}/{maxEdge}
        </span>
      </div>

      {/* Win/Loss Progress */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-green-400">WINS</span>
        <div className="flex gap-1">
          {Array.from({ length: totalDots }).map((_, i) => {
            const isWin = i < wins;

            return (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  isWin
                    ? 'bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.6)]'
                    : 'bg-gray-600/30 border border-gray-500/30'
                }`}
                title={isWin ? 'Win' : 'Needed'}
              />
            );
          })}
        </div>
        <span className="text-[10px] text-green-400/70">
          {wins}/{winsNeededForStage}
        </span>
      </div>
    </div>
  );
}
