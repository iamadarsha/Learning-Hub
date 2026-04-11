"use client";

import { InfiniteScroll } from "@/components/infinite-scroll";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DEFAULT_LIMIT } from "@/constants";
import { useTRPC } from "@/trpc/client";
import { useMutation, useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ErrorBoundary } from "react-error-boundary";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Suspense, useState } from "react";
import { toast } from "sonner";

const TYPE_COLORS: Record<string, string> = {
  tutorial: "text-[#009BFF]",
  tool: "text-[#770BFF]",
  doc: "text-[#4CC3AE]",
  template: "text-orange-400",
  video: "text-[#009BFF]",
};

export const ResourcesSection = () => {
  return (
    <Suspense fallback={<ResourcesSkeleton />}>
      <ErrorBoundary fallback={<p className="text-white/40 p-4">Error loading resources</p>}>
        <ResourcesSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const ResourcesSkeleton = () => {
  return (
    <div className="border-y border-white/[0.06] px-10">
      <Table>
        <TableHeader>
          <TableRow className="border-white/[0.06]">
            <TableHead className="w-[35%] text-white/50">Resource</TableHead>
            <TableHead className="w-[80px] text-white/50">Type</TableHead>
            <TableHead className="w-[100px] text-white/50">Status</TableHead>
            <TableHead className="w-[110px] text-white/50">Date</TableHead>
            <TableHead className="w-[60px] text-white/50">Views</TableHead>
            <TableHead className="w-[50px] text-white/50">XP</TableHead>
            <TableHead className="w-[120px] text-white/50">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 4 }).map((_, i) => (
            <TableRow key={i} className="border-white/[0.06]">
              <TableCell><div className="h-4 w-48 bg-white/[0.06] rounded animate-pulse" /></TableCell>
              <TableCell><div className="h-3 w-16 bg-white/[0.06] rounded animate-pulse" /></TableCell>
              <TableCell><div className="h-3 w-16 bg-white/[0.06] rounded animate-pulse" /></TableCell>
              <TableCell><div className="h-3 w-20 bg-white/[0.06] rounded animate-pulse" /></TableCell>
              <TableCell><div className="h-3 w-10 bg-white/[0.06] rounded animate-pulse" /></TableCell>
              <TableCell><div className="h-3 w-10 bg-white/[0.06] rounded animate-pulse" /></TableCell>
              <TableCell><div className="h-3 w-16 bg-white/[0.06] rounded animate-pulse" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const ResourcesSectionSuspense = () => {
  const trpc = useTRPC();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [unpublishTarget, setUnpublishTarget] = useState<string | null>(null);
  const [localUnpublished, setLocalUnpublished] = useState<Set<string>>(new Set());

  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useSuspenseInfiniteQuery(
      trpc.studio.getMany.infiniteQueryOptions(
        { limit: DEFAULT_LIMIT },
        {
          getNextPageParam(lastPage) {
            return lastPage.nextCursor;
          },
        }
      )
    );

  const utils = trpc;

  const { mutate: unpublish } = useMutation(
    trpc.resources.unpublish.mutationOptions({
      onSuccess: () => {
        toast.success("Resource unpublished");
      },
    })
  );

  const { mutate: republish } = useMutation(
    trpc.resources.republish.mutationOptions({
      onSuccess: () => {
        toast.success("Resource is live again");
      },
    })
  );

  const allResources = data.pages.flatMap((page) => page.items);
  const filteredResources = allResources.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase())
  );

  if (allResources.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-white/40 text-lg">No resources yet</p>
        <p className="text-white/20 text-sm mt-2">
          Submit your first resource and earn +25 XP!
        </p>
        <Link
          href="/studio/contribute"
          className="inline-block mt-4 px-6 py-2.5 bg-[#009BFF] text-white font-medium rounded-full hover:bg-[#009BFF]/90 transition-colors"
        >
          + Contribute
        </Link>
      </div>
    );
  }

  return (
    <div className="px-10">
      {/* Search bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search your resources..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm px-4 py-2 rounded-lg bg-[#00084D] border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#009BFF] transition-colors"
        />
      </div>

      <div className="border-y border-white/[0.06]">
        <Table>
          <TableHeader>
            <TableRow className="border-white/[0.06] hover:bg-transparent">
              <TableHead className="w-[35%] text-white/50">Resource</TableHead>
              <TableHead className="w-[80px] text-white/50">Type</TableHead>
              <TableHead className="w-[100px] text-white/50">Status</TableHead>
              <TableHead className="w-[110px] text-white/50">Date</TableHead>
              <TableHead className="w-[60px] text-white/50">Views</TableHead>
              <TableHead className="w-[50px] text-white/50">XP</TableHead>
              <TableHead className="w-[120px] text-white/50">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredResources.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-white/30 text-sm">
                  No resources found for &quot;{search}&quot;
                </TableCell>
              </TableRow>
            ) : (
              filteredResources.map((resource) => {
                const isPublished = resource.isPublished && !localUnpublished.has(resource.id);
                return (
                  <TableRow
                    key={resource.id}
                    className="border-white/[0.06] hover:bg-white/[0.02]"
                  >
                    <TableCell>
                      <Link href={`/resources/${resource.id}`} prefetch className="block">
                        <span className="text-sm text-[#FCFCFC] font-medium line-clamp-1">
                          {resource.title}
                        </span>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <span className={`text-xs font-medium capitalize ${TYPE_COLORS[resource.type] || "text-white/50"}`}>
                        {resource.type}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`text-xs font-medium ${isPublished ? "text-[#4CC3AE]" : "text-white/40"}`}>
                        {isPublished ? "Published" : "Unpublished"}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-white/50">
                      {format(resource.createdAt, "d MMM yyyy")}
                    </TableCell>
                    <TableCell className="text-sm text-white/50">
                      {resource.viewCount}
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-[#009BFF] font-medium">
                        +{resource.xpValue}
                      </span>
                    </TableCell>
                    <TableCell>
                      {isPublished ? (
                        <button
                          onClick={() => setUnpublishTarget(resource.id)}
                          className="text-sm text-red-400 hover:text-red-300 transition-colors"
                        >
                          Unpublish
                        </button>
                      ) : (
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => router.push(`/studio/contribute?resourceId=${resource.id}`)}
                            className="text-sm text-white/60 hover:text-white transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              setLocalUnpublished((prev) => {
                                const next = new Set(prev);
                                next.delete(resource.id);
                                return next;
                              });
                              republish({ resourceId: resource.id });
                            }}
                            className="text-sm text-[#4CC3AE] hover:text-[#4CC3AE]/80 transition-colors"
                          >
                            Republish
                          </button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <InfiniteScroll
        isManual
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
      />

      {/* Unpublish confirmation modal */}
      <Dialog open={!!unpublishTarget} onOpenChange={() => setUnpublishTarget(null)}>
        <DialogContent className="bg-[#00084D] border border-white/10 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white text-lg font-bold">
              Unpublish this resource?
            </DialogTitle>
            <DialogDescription className="text-white/60 text-sm leading-relaxed mt-2">
              This will remove it from the feed, explore, and everyone&apos;s continue watching.
              Your views and XP are safe. You can edit and republish anytime.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-3 mt-4">
            <button
              onClick={() => setUnpublishTarget(null)}
              className="flex-1 py-2 rounded-full border border-white/20 text-white/60 hover:text-white hover:border-white/40 text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (unpublishTarget) {
                  setLocalUnpublished((prev) => new Set(prev).add(unpublishTarget));
                  unpublish({ resourceId: unpublishTarget });
                  setUnpublishTarget(null);
                }
              }}
              className="flex-1 py-2 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 text-sm transition-colors"
            >
              Unpublish
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
