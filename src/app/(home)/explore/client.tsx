"use client";

import { ResourceCard } from "@/modules/resources/ui/components/resource-card";
import { useTRPC } from "@/trpc/client";
import { useInfiniteQuery, useSuspenseQuery } from "@tanstack/react-query";
import { CompassIcon, SearchIcon } from "lucide-react";
import { useState } from "react";

const RESOURCE_TYPES = [
  { value: "", label: "All Types" },
  { value: "video", label: "Video" },
  { value: "tutorial", label: "Tutorial" },
  { value: "doc", label: "Document" },
  { value: "tool", label: "Tool" },
  { value: "template", label: "Template" },
];

export const ExploreView = () => {
  const trpc = useTRPC();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");

  const { data: categories } = useSuspenseQuery(trpc.categories.getMany.queryOptions());

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery(
    trpc.resources.getMany.infiniteQueryOptions(
      {
        categoryId: selectedCategory || undefined,
        limit: 12,
      },
      { getNextPageParam: (lastPage) => lastPage.nextCursor }
    )
  );

  // Client-side filtering for search and type (server already filters by category)
  const allItems = data?.pages.flatMap((page) => page.items) ?? [];
  const filteredItems = allItems.filter((item) => {
    const matchesSearch =
      !searchQuery ||
      item.resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.resource.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !selectedType || item.resource.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="max-w-[2400px] mx-auto mb-10 px-4 pt-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[#009BFF]/10 flex items-center justify-center">
          <CompassIcon className="size-5 text-[#009BFF]" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-[#FCFCFC]">Explore</h1>
          <p className="text-white/40 text-sm">Discover resources across Pattern's knowledge base</p>
        </div>
      </div>

      {/* Search bar */}
      <div className="relative max-w-2xl mb-6">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-white/40" />
        <input
          type="text"
          placeholder="Search by title or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#00084D]/40 border border-white/[0.08] text-[#FCFCFC] placeholder:text-white/30 focus:outline-none focus:border-[#009BFF] focus:ring-1 focus:ring-[#009BFF]/30 transition-all text-sm"
        />
      </div>

      {/* Filters row */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {/* Category filter */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedCategory("")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !selectedCategory
                ? "bg-[#009BFF] text-white"
                : "bg-white/[0.04] text-white/60 hover:text-[#FCFCFC] border border-white/[0.08]"
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(selectedCategory === cat.id ? "" : cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat.id
                  ? "bg-[#009BFF] text-white"
                  : "bg-white/[0.04] text-white/60 hover:text-[#FCFCFC] border border-white/[0.08]"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Type filter */}
        <div className="flex gap-2 flex-wrap sm:ml-auto">
          {RESOURCE_TYPES.map((rt) => (
            <button
              key={rt.value}
              onClick={() => setSelectedType(selectedType === rt.value ? "" : rt.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                selectedType === rt.value
                  ? "bg-[#770BFF] text-white"
                  : "bg-white/[0.04] text-white/50 hover:text-[#FCFCFC] border border-white/[0.06]"
              }`}
            >
              {rt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs text-white/30 mb-4">
        {filteredItems.length} resource{filteredItems.length !== 1 ? "s" : ""} found
      </p>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
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
      ) : filteredItems.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredItems.map((item) => (
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
                    : item.resource.authorName
                      ? { name: item.resource.authorName, imageUrl: item.resource.authorImageUrl || "" }
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
            <div className="flex justify-center pt-8">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="px-6 py-2.5 bg-[#009BFF]/10 text-[#009BFF] rounded-full text-sm font-medium hover:bg-[#009BFF]/20 transition-colors disabled:opacity-50"
              >
                {isFetchingNextPage ? "Loading..." : "Load more resources"}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20">
          <p className="text-white/40 text-lg">No resources found</p>
          <p className="text-white/20 text-sm mt-2">
            {searchQuery || selectedType
              ? "Try adjusting your filters"
              : "Be the first to contribute!"}
          </p>
        </div>
      )}
    </div>
  );
};
