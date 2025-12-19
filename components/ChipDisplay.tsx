'use client';

interface ChipDisplayProps {
  amount: number;
  label?: string;
}

export default function ChipDisplay({ amount, label = 'Chips' }: ChipDisplayProps) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-black/60 rounded-lg border border-casino-gold-dark">
      {/* Chip Icon */}
      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-casino-gold to-casino-gold-dark border-2 border-casino-gold-light flex items-center justify-center shadow-lg">
        <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-casino-gold-light" />
      </div>

      {/* Amount */}
      <div className="flex flex-col">
        <span className="text-xs text-casino-gold-light uppercase">{label}</span>
        <span className="text-lg sm:text-xl md:text-2xl font-bold text-casino-gold">
          {amount}
        </span>
      </div>
    </div>
  );
}
