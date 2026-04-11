"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { BarChart3Icon, FlameIcon, TrophyIcon, ZapIcon } from "lucide-react";

const LEVEL_NAMES: Record<number, string> = {
  1: "Learner", 2: "Explorer", 3: "Builder", 4: "Expert", 5: "PAIoneer",
};

export const XPHistoryView = () => {
  const trpc = useTRPC();
  const { data: xpData, isLoading } = useQuery(trpc.users.getMyXP.queryOptions());

  const level = xpData?.level ?? 1;
  const totalXp = xpData?.totalXp ?? 0;
  const streak = xpData?.streak ?? 0;

  return (
    <div className="max-w-3xl mx-auto pt-6 px-4">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-[#770BFF]/10 flex items-center justify-center">
          <ZapIcon className="size-5 text-[#770BFF]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#FCFCFC]">XP History</h1>
          <p className="text-sm text-white/40">Your experience points breakdown</p>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-[#00084D]/40 border border-white/[0.08] rounded-2xl p-5 text-center">
          <TrophyIcon className="size-5 text-[#009BFF] mx-auto mb-2" />
          <p className="text-2xl font-bold text-[#FCFCFC]">{totalXp.toLocaleString()}</p>
          <p className="text-xs text-white/40 mt-1">Total XP</p>
        </div>
        <div className="bg-[#00084D]/40 border border-white/[0.08] rounded-2xl p-5 text-center">
          <BarChart3Icon className="size-5 text-[#770BFF] mx-auto mb-2" />
          <p className="text-2xl font-bold text-[#FCFCFC]">Lv. {level}</p>
          <p className="text-xs text-white/40 mt-1">{LEVEL_NAMES[level]}</p>
        </div>
        <div className="bg-[#00084D]/40 border border-white/[0.08] rounded-2xl p-5 text-center">
          <FlameIcon className="size-5 text-orange-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-[#FCFCFC]">{streak}</p>
          <p className="text-xs text-white/40 mt-1">Day Streak</p>
        </div>
      </div>

      {/* XP Earning Guide */}
      <div className="bg-[#00084D]/40 border border-white/[0.08] rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-[#FCFCFC] mb-4">How to Earn XP</h3>
        <div className="space-y-3">
          <XPRow action="View a resource" xp={5} color="#009BFF" />
          <XPRow action="Complete a resource" xp={10} color="#4CC3AE" />
          <XPRow action="Submit a resource" xp={25} color="#770BFF" />
          <XPRow action="First submission bonus" xp={50} color="#FFA500" />
          <XPRow action="Daily streak" xp={15} color="#FF6B35" />
        </div>
      </div>

      {/* Levels */}
      <div className="bg-[#00084D]/40 border border-white/[0.08] rounded-2xl p-6 mt-6">
        <h3 className="text-lg font-semibold text-[#FCFCFC] mb-4">Level Milestones</h3>
        <div className="space-y-3">
          <LevelRow level={1} name="Learner" minXp={0} current={level >= 1} />
          <LevelRow level={2} name="Explorer" minXp={100} current={level >= 2} />
          <LevelRow level={3} name="Builder" minXp={300} current={level >= 3} />
          <LevelRow level={4} name="Expert" minXp={600} current={level >= 4} />
          <LevelRow level={5} name="PAIoneer" minXp={1000} current={level >= 5} />
        </div>
      </div>
    </div>
  );
};

function XPRow({ action, xp, color }: { action: string; xp: number; color: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
      <span className="text-sm text-white/60">{action}</span>
      <span className="text-sm font-semibold" style={{ color }}>+{xp} XP</span>
    </div>
  );
}

function LevelRow({ level, name, minXp, current }: { level: number; name: string; minXp: number; current: boolean }) {
  return (
    <div className={`flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0 ${current ? "opacity-100" : "opacity-40"}`}>
      <div className="flex items-center gap-3">
        <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${current ? "bg-[#009BFF] text-white" : "bg-white/10 text-white/40"}`}>
          {level}
        </span>
        <span className="text-sm text-[#FCFCFC] font-medium">{name}</span>
      </div>
      <span className="text-xs text-white/40">{minXp.toLocaleString()} XP</span>
    </div>
  );
}
