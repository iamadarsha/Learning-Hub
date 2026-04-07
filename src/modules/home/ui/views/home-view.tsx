"use client";

import { ResourceCard } from "@/modules/resources/ui/components/resource-card";
import { ProgressResourceCard } from "@/modules/resources/ui/components/progress-resource-card";
import { useTRPC } from "@/trpc/client";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { ChevronRightIcon } from "lucide-react";
import { Suspense, useRef } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { CategoriesSection } from "../sections/categories-section";

interface HomeViewProps {
  categoryId?: string;
}

// Mock data for Continue Watching — will be replaced by real view tracking later
const CONTINUE_WATCHING = [
  {
    id: "cw-1",
    title: "Getting started with Pi — Pattern's AI assistant",
    type: "video",
    authorName: "Hyvmind Team",
    duration: "12:34",
    progress: 65,
  },
  {
    id: "cw-2",
    title: "How to build your first n8n workflow",
    type: "tutorial",
    authorName: "Hyvmind Team",
    duration: "18:45",
    progress: 32,
  },
  {
    id: "cw-3",
    title: "Figma Variables deep dive",
    type: "video",
    authorName: "Hyvmind Team",
    duration: "24:10",
    progress: 78,
  },
  {
    id: "cw-4",
    title: "Bulk image generation with AI tools",
    type: "video",
    authorName: "Hyvmind Team",
    duration: "9:52",
    progress: 15,
  },
  {
    id: "cw-5",
    title: "Writing effective Claude prompts for data extraction",
    type: "tutorial",
    authorName: "Hyvmind Team",
    duration: "15:20",
    progress: 50,
  },
];

const LAST_WATCHED = [
  {
    id: "lw-1",
    title: "Amazon listing optimisation checklist walkthrough",
    type: "video",
    authorName: "Hyvmind Team",
    duration: "22:15",
    progress: 100,
  },
  {
    id: "lw-2",
    title: "Building dashboards with Looker Studio",
    type: "tutorial",
    authorName: "Hyvmind Team",
    duration: "31:08",
    progress: 100,
  },
  {
    id: "lw-3",
    title: "Prompt engineering masterclass — Part 1",
    type: "video",
    authorName: "Hyvmind Team",
    duration: "45:22",
    progress: 100,
  },
  {
    id: "lw-4",
    title: "n8n + Slack integration deep dive",
    type: "tutorial",
    authorName: "Hyvmind Team",
    duration: "14:30",
    progress: 100,
  },
];

export const HomeView = ({ categoryId }: HomeViewProps) => {
  return (
    <div className="max-w-[2400px] mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
      <CategoriesSection categoryId={categoryId} />

      {/* Continue Watching */}
      <HorizontalSection
        title="Continue Watching"
        subtitle="Pick up where you left off"
        items={CONTINUE_WATCHING}
      />

      {/* Last Watched */}
      <HorizontalSection
        title="Last Watched"
        subtitle="Recently completed"
        items={LAST_WATCHED}
      />

      {/* All Resources */}
      <div>
        <h2 className="text-lg font-bold text-[#FCFCFC] mb-1">All Resources</h2>
        <p className="text-xs text-white/40 mb-4">Browse the full knowledge library</p>
      </div>
      <Suspense fallback={<ResourceGridSkeleton />}>
        <ErrorBoundary fallback={<div className="text-white/40">Failed to load resources</div>}>
          <ResourceGrid categoryId={categoryId} />
        </ErrorBoundary>
      </Suspense>
    </div>
  );
};

// ─── Horizontal scroll section ───

interface HorizontalSectionProps {
  title: string;
  subtitle: string;
  items: {
    id: string;
    title: string;
    type: string;
    authorName?: string;
    duration?: string;
    progress: number;
    thumbnailUrl?: string | null;
  }[];
}

const HorizontalSection = ({ title, subtitle, items }: HorizontalSectionProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 320, behavior: "smooth" });
  };

  return (
    <div>
      {/* Section header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-lg font-bold text-[#FCFCFC]">{title}</h2>
          <p className="text-xs text-white/40">{subtitle}</p>
        </div>
        <button
          onClick={scrollRight}
          className="flex items-center gap-1 text-xs text-[#009BFF] hover:text-[#009BFF]/80 transition-colors"
        >
          See all
          <ChevronRightIcon className="size-3.5" />
        </button>
      </div>

      {/* Horizontal scroll */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-hidden pb-2"
      >
        {items.map((item) => (
          <ProgressResourceCard
            key={item.id}
            id={item.id}
            title={item.title}
            type={item.type}
            thumbnailUrl={item.thumbnailUrl}
            authorName={item.authorName}
            duration={item.duration}
            progress={item.progress}
          />
        ))}
      </div>
    </div>
  );
};

// ─── Resource grid ───

const ResourceGrid = ({ categoryId }: { categoryId?: string }) => {
  const trpc = useTRPC();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(
      trpc.resources.getMany.infiniteQueryOptions(
        { categoryId: categoryId || undefined, limit: 12 },
        { getNextPageParam: (lastPage) => lastPage.nextCursor }
      )
    );

  const allItems = data.pages.flatMap((page) => page.items);

  if (allItems.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-white/40 text-lg">No resources found</p>
        <p className="text-white/20 text-sm mt-2">Be the first to contribute!</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {allItems.map((item) => (
          <ResourceCard
            key={item.resource.id}
            id={item.resource.id}
            title={item.resource.title}
            description={item.resource.description}
            type={item.resource.type}
            thumbnailUrl={item.resource.thumbnailUrl}
            xpValue={item.resource.xpValue}
            viewCount={item.resource.viewCount}
            author={
              item.user
                ? { name: item.user.name, imageUrl: item.user.imageUrl }
                : null
            }
            category={
              item.category
                ? { name: item.category.name, color: item.category.color }
                : null
            }
          />
        ))}
      </div>
      {hasNextPage && (
        <div className="flex justify-center pt-6">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="px-6 py-2 bg-[#009BFF]/10 text-[#009BFF] rounded-full text-sm font-medium hover:bg-[#009BFF]/20 transition-colors disabled:opacity-50"
          >
            {isFetchingNextPage ? "Loading..." : "Load more"}
          </button>
        </div>
      )}
    </>
  );
};

const ResourceGridSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-[#00084D]/60 border border-white/[0.08] rounded-2xl p-5 animate-pulse"
        >
          <div className="aspect-video rounded-xl bg-white/[0.04] mb-4" />
          <div className="h-3 w-16 rounded-full bg-white/[0.06] mb-3" />
          <div className="h-4 w-3/4 rounded bg-white/[0.06] mb-2" />
          <div className="h-3 w-1/2 rounded bg-white/[0.04]" />
        </div>
      ))}
    </div>
  );
};
