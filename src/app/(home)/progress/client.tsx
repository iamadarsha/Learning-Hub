"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { BarChart3Icon, CheckCircleIcon, EyeIcon, FlameIcon, TrophyIcon } from "lucide-react";
import Link from "next/link";

const LEVEL_COLORS: Record<number, string> = {
  1: "from-[#009BFF] to-[#00084D]",
  2: "from-[#4CC3AE] to-[#00084D]",
  3: "from-[#770BFF] to-[#00084D]",
  4: "from-[#FFA500] to-[#00084D]",
  5: "from-[#FFD700] to-[#770BFF]",
};

const LEVEL_NAMES: Record<number, string> = {
  1: "Learner",
  2: "Explorer",
  3: "Builder",
  4: "Expert",
  5: "PAIoneer",
};

export const ProgressView = () => {
  const trpc = useTRPC();
  const { data: xpData, isLoading: xpLoading } = useQuery(trpc.users.getMyXP.queryOptions());
  const { data: history, isLoading: histLoading } = useQuery(trpc.progress.getHistory.queryOptions());
  const { data: inProgress } = useQuery(trpc.progress.getInProgress.queryOptions());
  const { data: completed } = useQuery(trpc.progress.getCompleted.queryOptions());

  const level = xpData?.level ?? 1;
  const totalXp = xpData?.totalXp ?? 0;
  const streak = xpData?.streak ?? 0;
  const nextLevelXp = [0, 100, 300, 600, 1000, 99999][level];
  const prevLevelXp = [0, 0, 100, 300, 600, 1000][level];
  const progressPct = Math.min(100, Math.round(((totalXp - prevLevelXp) / (nextLevelXp - prevLevelXp)) * 100));

  return (
    <div className="max-w-4xl mx-auto mb-10 px-4 pt-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-[#009BFF]/10 flex items-center justify-center">
          <BarChart3Icon className="size-5 text-[#009BFF]" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-[#FCFCFC]">My Progress</h1>
          <p className="text-white/40 text-sm">Track your learning journey at Pattern</p>
        </div>
      </div>

      {/* XP Hero Card */}
      <div className={`bg-gradient-to-br ${LEVEL_COLORS[level]} border border-white/[0.1] rounded-2xl p-8 mb-8`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-white/60 text-sm mb-1">Current Level</p>
            <h2 className="text-4xl font-bold text-[#FCFCFC]">{LEVEL_NAMES[level]}</h2>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-[#FCFCFC]">{totalXp.toLocaleString()}</p>
            <p className="text-white/60 text-sm">Total XP</p>
          </div>
        </div>

        {/* Progress bar to next level */}
        {level < 5 && (
          <div>
            <div className="flex justify-between text-xs text-white/50 mb-2">
              <span>Level {level}</span>
              <span>{nextLevelXp - totalXp} XP to Level {level + 1}</span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#009BFF] rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
          <Stat icon={<FlameIcon className="size-4 text-orange-400" />} value={`${streak} days`} label="Streak" />
          <Stat icon={<EyeIcon className="size-4 text-[#009BFF]" />} value={`${history?.length ?? 0}`} label="Resources Viewed" />
          <Stat icon={<CheckCircleIcon className="size-4 text-[#4CC3AE]" />} value={`${completed?.length ?? 0}`} label="Completed" />
        </div>
      </div>

      {/* In Progress */}
      <section className="mb-8">
        <h3 className="text-lg font-bold text-[#FCFCFC] mb-4">In Progress</h3>
        {inProgress && inProgress.length > 0 ? (
          <div className="space-y-2">
            {inProgress.map((item) => (
              <Link
                key={item.view.id}
                href={`/resources/${item.view.resourceId}`}
                className="flex items-center gap-4 p-4 bg-[#00084D]/40 border border-white/[0.08] rounded-xl hover:border-[#009BFF] transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-[#009BFF]/10 flex items-center justify-center shrink-0">
                  <EyeIcon className="size-4 text-[#009BFF]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#FCFCFC] font-medium truncate">{item.resource?.title}</p>
                  <p className="text-xs text-white/30">Started {new Date(item.view.viewedAt).toLocaleDateString()}</p>
                </div>
                <span className="text-xs text-[#009BFF] bg-[#009BFF]/10 px-2 py-0.5 rounded-full shrink-0">In progress</span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-white/30 text-sm py-8 text-center">No resources in progress. Start exploring!</p>
        )}
      </section>

      {/* Recently Completed */}
      <section>
        <h3 className="text-lg font-bold text-[#FCFCFC] mb-4">Recently Completed</h3>
        {completed && completed.length > 0 ? (
          <div className="space-y-2">
            {completed.map((item) => (
              <Link
                key={item.view.id}
                href={`/resources/${item.view.resourceId}`}
                className="flex items-center gap-4 p-4 bg-[#00084D]/40 border border-white/[0.08] rounded-xl hover:border-[#4CC3AE] transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-[#4CC3AE]/10 flex items-center justify-center shrink-0">
                  <CheckCircleIcon className="size-4 text-[#4CC3AE]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#FCFCFC] font-medium truncate">{item.resource?.title}</p>
                  <p className="text-xs text-white/30">Completed {item.view.completedAt ? new Date(item.view.completedAt).toLocaleDateString() : ""}</p>
                </div>
                <span className="text-xs text-[#4CC3AE] bg-[#4CC3AE]/10 px-2 py-0.5 rounded-full shrink-0">Done</span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-white/30 text-sm py-8 text-center">No completed resources yet. Keep learning!</p>
        )}
      </section>
    </div>
  );
};

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-1.5 mb-1">
        {icon}
        <span className="text-lg font-bold text-[#FCFCFC]">{value}</span>
      </div>
      <p className="text-xs text-white/40">{label}</p>
    </div>
  );
}
