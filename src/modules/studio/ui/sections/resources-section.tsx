"use client";

import { InfiniteScroll } from "@/components/infinite-scroll";
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
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ErrorBoundary } from "react-error-boundary";
import { GlobeIcon, LockIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

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
    <div className="border-y border-white/[0.06]">
      <Table>
        <TableHeader>
          <TableRow className="border-white/[0.06]">
            <TableHead className="pl-6 w-[400px] text-white/50">Resource</TableHead>
            <TableHead className="text-white/50">Type</TableHead>
            <TableHead className="text-white/50">Visibility</TableHead>
            <TableHead className="text-white/50">Date</TableHead>
            <TableHead className="text-white/50">Views</TableHead>
            <TableHead className="text-white/50">XP</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 4 }).map((_, i) => (
            <TableRow key={i} className="border-white/[0.06]">
              <TableCell className="pl-6">
                <div className="flex flex-col gap-2">
                  <div className="h-4 w-48 bg-white/[0.06] rounded animate-pulse" />
                  <div className="h-3 w-64 bg-white/[0.04] rounded animate-pulse" />
                </div>
              </TableCell>
              <TableCell>
                <div className="h-3 w-16 bg-white/[0.06] rounded animate-pulse" />
              </TableCell>
              <TableCell>
                <div className="h-3 w-16 bg-white/[0.06] rounded animate-pulse" />
              </TableCell>
              <TableCell>
                <div className="h-3 w-20 bg-white/[0.06] rounded animate-pulse" />
              </TableCell>
              <TableCell>
                <div className="h-3 w-10 bg-white/[0.06] rounded animate-pulse" />
              </TableCell>
              <TableCell>
                <div className="h-3 w-10 bg-white/[0.06] rounded animate-pulse" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const ResourcesSectionSuspense = () => {
  const trpc = useTRPC();
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

  const allResources = data.pages.flatMap((page) => page.items);

  if (allResources.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-white/40 text-lg">No resources yet</p>
        <p className="text-white/20 text-sm mt-2">
          Submit your first resource and earn +25 XP!
        </p>
        <Link
          href="/studio/submit"
          className="inline-block mt-4 px-6 py-2.5 bg-[#009BFF] text-white font-medium rounded-full hover:bg-[#009BFF]/90 transition-colors"
        >
          + Submit Resource
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="border-y border-white/[0.06]">
        <Table>
          <TableHeader>
            <TableRow className="border-white/[0.06] hover:bg-transparent">
              <TableHead className="pl-6 w-[400px] text-white/50">Resource</TableHead>
              <TableHead className="text-white/50">Type</TableHead>
              <TableHead className="text-white/50">Visibility</TableHead>
              <TableHead className="text-white/50">Date</TableHead>
              <TableHead className="text-white/50">Views</TableHead>
              <TableHead className="text-white/50">XP</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allResources.map((resource) => (
              <TableRow
                key={resource.id}
                className="cursor-pointer border-white/[0.06] hover:bg-white/[0.02]"
              >
                <TableCell className="pl-6">
                  <Link href={`/resources/${resource.id}`} prefetch className="block">
                    <div className="flex flex-col gap-y-1">
                      <span className="text-sm text-[#FCFCFC] font-medium line-clamp-1">
                        {resource.title}
                      </span>
                      <span className="text-xs text-white/40 line-clamp-1">
                        {resource.description || "No description"}
                      </span>
                    </div>
                  </Link>
                </TableCell>
                <TableCell>
                  <span
                    className={`text-xs font-medium capitalize ${TYPE_COLORS[resource.type] || "text-white/50"}`}
                  >
                    {resource.type}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-white/60 text-sm">
                    {resource.visibility === "private" ? (
                      <LockIcon className="size-3.5 mr-1.5" />
                    ) : (
                      <GlobeIcon className="size-3.5 mr-1.5" />
                    )}
                    <span className="capitalize">{resource.visibility}</span>
                  </div>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <InfiniteScroll
        isManual
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
      />
    </div>
  );
};
