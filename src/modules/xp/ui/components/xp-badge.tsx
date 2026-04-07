import { LEVEL_THRESHOLDS } from "@/modules/xp/server/procedures";

interface XpBadgeProps {
  totalXp: number;
  level: number;
  size?: "sm" | "md" | "lg";
}

const LEVEL_COLORS: Record<number, string> = {
  1: "bg-[#009BFF]/20 text-[#009BFF]",
  2: "bg-[#009BFF] text-white",
  3: "bg-[#770BFF] text-white",
  4: "bg-[#4CC3AE] text-white",
  5: "bg-gradient-to-r from-[#009BFF] to-[#770BFF] text-white",
};

export const XpBadge = ({ totalXp, level, size = "sm" }: XpBadgeProps) => {
  const levelName =
    LEVEL_THRESHOLDS.find((t) => t.level === level)?.name || "Learner";
  const colorClass = LEVEL_COLORS[level] || LEVEL_COLORS[1];

  if (size === "sm") {
    return (
      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${colorClass}`}>
        {totalXp.toLocaleString()} XP
      </span>
    );
  }

  if (size === "md") {
    return (
      <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${colorClass}`}>
        <span>Lv.{level}</span>
        <span className="opacity-70">·</span>
        <span>{totalXp.toLocaleString()} XP</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`text-sm font-bold px-4 py-1.5 rounded-full ${colorClass}`}>
        {levelName}
      </div>
      <span className="text-xs text-white/50">{totalXp.toLocaleString()} XP</span>
    </div>
  );
};
