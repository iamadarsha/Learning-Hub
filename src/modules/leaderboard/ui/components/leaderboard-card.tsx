import { UserAvatar } from "@/components/user-avatar";

interface LeaderboardEntryProps {
  rank: number;
  name: string;
  imageUrl: string;
  totalXp: number;
  level: number;
  streak: number;
}

const RANK_GRADIENTS: Record<number, string> = {
  1: "bg-gradient-to-br from-[#009BFF] to-[#00084D] border-yellow-500/30",
  2: "bg-gradient-to-br from-[#00084D] to-[#770BFF] border-gray-400/30",
  3: "bg-gradient-to-br from-[#00084D] to-[#4CC3AE] border-amber-600/30",
};

const RANK_LABELS: Record<number, string> = {
  1: "🥇",
  2: "🥈",
  3: "🥉",
};

export const LeaderboardTopCard = ({
  rank,
  name,
  imageUrl,
  totalXp,
  level,
  streak,
}: LeaderboardEntryProps) => {
  const gradient = RANK_GRADIENTS[rank] || "";

  return (
    <div
      className={`${gradient} border rounded-2xl p-6 flex flex-col items-center text-center relative overflow-hidden`}
    >
      {/* Rank badge */}
      <span className="text-2xl mb-3">{RANK_LABELS[rank]}</span>

      {/* Avatar */}
      <UserAvatar imageUrl={imageUrl} name={name} size="lg" className="size-16 mb-3" />

      {/* Name */}
      <h3 className="text-[#FCFCFC] font-bold text-lg">{name}</h3>

      {/* XP */}
      <p className="text-[#009BFF] font-semibold text-xl mt-2">
        {totalXp.toLocaleString()} XP
      </p>

      {/* Meta */}
      <div className="flex items-center gap-3 mt-2 text-xs text-white/50">
        <span>Level {level}</span>
        {streak > 0 && <span>🔥 {streak} day streak</span>}
      </div>
    </div>
  );
};

export const LeaderboardRow = ({
  rank,
  name,
  imageUrl,
  totalXp,
  level,
  streak,
}: LeaderboardEntryProps) => {
  return (
    <div className="flex items-center gap-4 py-3 px-4 border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
      {/* Rank */}
      <span className="text-sm font-semibold text-white/40 w-8 text-right">{rank}</span>

      {/* Avatar */}
      <UserAvatar imageUrl={imageUrl} name={name} size="xs" />

      {/* Name */}
      <span className="text-sm text-[#FCFCFC] font-medium flex-1">{name}</span>

      {/* Streak */}
      {streak > 0 && (
        <span className="text-xs text-white/30">🔥 {streak}d</span>
      )}

      {/* Level */}
      <span className="text-xs text-white/40 w-12 text-right">Lv.{level}</span>

      {/* XP */}
      <span className="text-sm font-semibold text-[#009BFF] w-20 text-right">
        {totalXp.toLocaleString()} XP
      </span>
    </div>
  );
};
