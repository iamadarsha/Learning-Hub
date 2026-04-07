"use client";

import { ExpertCard } from "@/modules/experts/ui/components/expert-card";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { SearchIcon } from "lucide-react";
import { useState } from "react";

const TEAMS = ["All Teams", "Conversion", "Creative", "Engineering", "Data", "Product"];

export const ExpertsView = () => {
  const trpc = useTRPC();
  const [selectedTeam, setSelectedTeam] = useState<string | undefined>(undefined);
  const [query, setQuery] = useState("");

  const { data, isLoading } = useQuery(
    trpc.experts.getMany.queryOptions({
      team: selectedTeam,
      query: query || undefined,
      limit: 50,
    })
  );

  return (
    <div className="max-w-[2400px] mx-auto mb-10 px-4 pt-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#FCFCFC] mb-2">Find an Expert</h1>
        <p className="text-white/40">Connect with knowledgeable team members across Pattern</p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40" />
          <input
            type="text"
            placeholder="Search experts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#00084D]/40 border border-white/[0.08] text-[#FCFCFC] placeholder:text-white/40 focus:outline-none focus:border-[#009BFF] transition-colors text-sm"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {TEAMS.map((team) => {
            const isActive =
              team === "All Teams" ? !selectedTeam : selectedTeam === team;
            return (
              <button
                key={team}
                onClick={() =>
                  setSelectedTeam(team === "All Teams" ? undefined : team)
                }
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#009BFF] text-white"
                    : "bg-white/[0.04] text-white/60 hover:text-[#FCFCFC] border border-white/[0.08]"
                }`}
              >
                {team}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-[#00084D] border border-white/[0.1] rounded-2xl p-6 animate-pulse flex flex-col items-center"
            >
              <div className="size-12 rounded-full bg-white/[0.06] mb-4" />
              <div className="h-4 w-24 rounded bg-white/[0.06] mb-2" />
              <div className="h-3 w-20 rounded bg-white/[0.04]" />
            </div>
          ))}
        </div>
      ) : data && data.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {data.map((item) => (
            <ExpertCard
              key={item.profile.id}
              displayName={item.profile.displayName}
              role={item.profile.role}
              team={item.profile.team}
              skills={item.profile.skills}
              bio={item.profile.bio}
              resourceCount={item.profile.resourceCount}
              isVerified={item.profile.isVerified}
              imageUrl={item.user?.imageUrl}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-white/40 text-lg">No experts found</p>
          <p className="text-white/20 text-sm mt-2">Try adjusting your search</p>
        </div>
      )}
    </div>
  );
};
