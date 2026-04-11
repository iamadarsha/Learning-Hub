"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { ClockIcon } from "lucide-react";
import Link from "next/link";

const TYPE_COLORS: Record<string, string> = {
  tutorial: "text-[#009BFF]",
  video: "text-[#009BFF]",
  tool: "text-[#770BFF]",
  doc: "text-[#4CC3AE]",
  template: "text-orange-400",
};

export const HistoryView = () => {
  const trpc = useTRPC();
  const { data, isLoading } = useQuery(trpc.progress.getHistory.queryOptions());

  return (
    <div className="max-w-4xl mx-auto mb-10 px-4 pt-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-[#009BFF]/10 flex items-center justify-center">
          <ClockIcon className="size-5 text-[#009BFF]" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-[#FCFCFC]">Recently Viewed</h1>
          <p className="text-white/40 text-sm">Resources you've recently opened</p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-[#00084D]/40 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : data && data.length > 0 ? (
        <div className="space-y-2">
          {data.map((item) => (
            <Link
              key={item.view.id}
              href={`/resources/${item.view.resourceId}`}
              className="flex items-center gap-4 p-4 bg-[#00084D]/40 border border-white/[0.08] rounded-xl hover:border-[#009BFF] transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#FCFCFC] font-medium truncate">{item.resource?.title ?? "Untitled"}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs capitalize ${TYPE_COLORS[item.resource?.type ?? "doc"]}`}>
                    {item.resource?.type}
                  </span>
                  <span className="text-xs text-white/30">
                    {new Date(item.view.viewedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              {item.view.completedAt ? (
                <span className="text-xs text-[#4CC3AE] bg-[#4CC3AE]/10 px-2 py-0.5 rounded-full">Completed</span>
              ) : (
                <span className="text-xs text-[#009BFF] bg-[#009BFF]/10 px-2 py-0.5 rounded-full">Viewed</span>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-white/40 text-lg">No viewing history yet</p>
          <p className="text-white/20 text-sm mt-2">Start exploring resources to build your history</p>
        </div>
      )}
    </div>
  );
};
