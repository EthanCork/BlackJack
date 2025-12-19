import type { Challenge } from '@/types/challenges';

interface ChallengeCardProps {
  challenge: Challenge;
  onRemove?: () => void;
  canRemove?: boolean;
  showRemoveCost?: boolean;
}

export default function ChallengeCard({
  challenge,
  onRemove,
  canRemove = false,
  showRemoveCost = true
}: ChallengeCardProps) {
  return (
    <div className={`
      relative p-4 rounded-lg border-2 transition-all
      ${getCategoryStyle(challenge.category)}
    `}>
      {/* Icon */}
      <div className="text-4xl mb-2 text-center">
        {challenge.icon}
      </div>

      {/* Name */}
      <div className="text-lg font-bold text-center mb-2">
        {challenge.name}
      </div>

      {/* Description */}
      <div className="text-sm text-gray-300 text-center mb-3">
        {challenge.description}
      </div>

      {/* Remove Button */}
      {onRemove && (
        <button
          onClick={onRemove}
          disabled={!canRemove}
          className={`
            w-full py-2 rounded font-bold text-sm
            ${canRemove
              ? 'bg-red-600 hover:bg-red-500 cursor-pointer'
              : 'bg-gray-700 cursor-not-allowed opacity-50'}
          `}
        >
          {showRemoveCost ? `Remove (${challenge.removeCost} chips)` : 'Remove'}
        </button>
      )}

      {/* Category Badge */}
      <div className="absolute -top-2 -right-2 px-2 py-1 bg-black border-2 border-white rounded text-xs font-bold uppercase">
        {challenge.category}
      </div>
    </div>
  );
}

function getCategoryStyle(category: string): string {
  switch (category) {
    case 'economy':
      return 'bg-yellow-900 border-yellow-600';
    case 'rules':
      return 'bg-red-900 border-red-600';
    case 'cards':
      return 'bg-blue-900 border-blue-600';
    case 'powers':
      return 'bg-purple-900 border-purple-600';
    case 'psychological':
      return 'bg-pink-900 border-pink-600';
    default:
      return 'bg-gray-900 border-gray-600';
  }
}
