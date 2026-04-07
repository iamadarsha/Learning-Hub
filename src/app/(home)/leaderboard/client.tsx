"use client";

import {
  LeaderboardRow,
  LeaderboardTopCard,
} from "@/modules/leaderboard/ui/components/leaderboard-card";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

export const LeaderboardView = () => {
  const trpc = useTRPC();
  const { data, isLoading } = useQuery(
    trpc.leaderboard.getTop.queryOptions({ limit: 20 })
  );

  return (
    <div className="max-w-4xl mx-auto mb-10 px-4 pt-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-[#FCFCFC] mb-2">Leaderboard</h1>
        <p className="text-white/40">
          Top contributors across Pattern&apos;s knowledge ecosystem
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-[#00084D] rounded-2xl p-6 animate-pulse flex flex-col items-center"
              >
                <div className="size-16 rounded-full bg-white/[0.06] mb-3" />
                <div className="h-4 w-24 rounded bg-white/[0.06] mb-2" />
                <div className="h-5 w-16 rounded bg-white/[0.04]" />
              </div>
            ))}
          </div>
        </div>
      ) : data && data.length > 0 ? (
        <>
          {/* Top 3 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {data.slice(0, 3).map((entry) => (
              <LeaderboardTopCard
                key={entry.xp.id}
                rank={entry.rank}
                name={entry.user?.name || "Unknown"}
                imageUrl={entry.user?.imageUrl || ""}
                totalXp={entry.xp.totalXp}
                level={entry.xp.level}
                streak={entry.xp.streak}
              />
            ))}
          </div>

          {/* Rank 4+ */}
          {data.length > 3 && (
            <div className="bg-[#00084D]/40 rounded-2xl border border-white/[0.08] overflow-hidden">
              {data.slice(3).map((entry) => (
                <LeaderboardRow
                  key={entry.xp.id}
                  rank={entry.rank}
                  name={entry.user?.name || "Unknown"}
                  imageUrl={entry.user?.imageUrl || ""}
                  totalXp={entry.xp.totalXp}
                  level={entry.xp.level}
                  streak={entry.xp.streak}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20">
          <p className="text-white/40 text-lg">No data yet</p>
          <p className="text-white/20 text-sm mt-2">
            Start viewing and sharing resources to earn XP!
          </p>
        </div>
      )}
    </div>
  );
};
