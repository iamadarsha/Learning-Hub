"use client";

import { UserAvatar } from "@/components/user-avatar";
import { getDriveEmbedUrl } from "@/lib/drive";
import { useTRPC } from "@/trpc/client";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeftIcon, ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

const TYPE_COLORS: Record<string, string> = {
  tutorial: "bg-[#009BFF]/20 text-[#009BFF]",
  tool: "bg-[#770BFF]/20 text-[#770BFF]",
  doc: "bg-[#4CC3AE]/20 text-[#4CC3AE]",
  template: "bg-orange-500/20 text-orange-400",
  video: "bg-[#009BFF]/20 text-[#009BFF]",
};

export const ResourceDetailView = ({ resourceId }: { resourceId: string }) => {
  const trpc = useTRPC();
  const hasRecorded = useRef(false);

  const { data } = useSuspenseQuery(
    trpc.resources.getOne.queryOptions({ id: resourceId })
  );

  const recordView = useMutation(
    trpc.xp.recordView.mutationOptions({
      onSuccess: (result) => {
        if (result.xpAwarded > 0) {
          toast.success(`+${result.xpAwarded} XP earned!`, {
            description: `Total: ${result.totalXp} XP`,
          });
        }
      },
    })
  );

  useEffect(() => {
    if (!hasRecorded.current) {
      hasRecorded.current = true;
      recordView.mutate({ resourceId });
    }
  }, [resourceId]);

  const { resource, user, category } = data;

  return (
    <div className="max-w-4xl mx-auto mb-10 px-4 pt-6">
      {/* Back */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-[#009BFF] transition-colors mb-6"
      >
        <ArrowLeftIcon className="size-4" />
        Back to resources
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span
            className={`text-xs font-medium px-2.5 py-0.5 rounded-full capitalize ${TYPE_COLORS[resource.type] || TYPE_COLORS.doc}`}
          >
            {resource.type}
          </span>
          {category && (
            <span className="text-xs text-white/40">
              {category.name}
            </span>
          )}
          <span className="text-xs font-medium text-[#009BFF] bg-[#009BFF]/10 px-2 py-0.5 rounded-full">
            +{resource.xpValue} XP
          </span>
        </div>

        <h1 className="text-3xl font-bold text-[#FCFCFC] mb-4">{resource.title}</h1>

        {/* Author */}
        {user && (
          <div className="flex items-center gap-3 mb-6">
            <UserAvatar imageUrl={user.imageUrl} name={user.name} size="sm" />
            <div>
              <p className="text-sm text-[#FCFCFC] font-medium">{user.name}</p>
              <p className="text-xs text-white/40">
                {resource.viewCount} views · {new Date(resource.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Content area — Google Drive embed or external link */}
      {resource.url && (() => {
        const embedUrl = getDriveEmbedUrl(resource.url);
        if (embedUrl) {
          return (
            <div className="mb-8 rounded-2xl overflow-hidden border border-white/[0.08]">
              <iframe
                src={embedUrl}
                className="w-full aspect-video"
                allow="autoplay"
                allowFullScreen
              />
            </div>
          );
        }
        return (
          <div className="mb-8">
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#009BFF] hover:bg-[#009BFF]/90 text-white font-medium rounded-full transition-colors"
            >
              <ExternalLinkIcon className="size-4" />
              Open Resource
            </a>
          </div>
        );
      })()}

      {/* Thumbnail (shown when no embed) */}
      {resource.thumbnailUrl && !getDriveEmbedUrl(resource.url || "") && (
        <div className="aspect-video rounded-2xl overflow-hidden mb-8 bg-[#00084D] border border-white/[0.08]">
          <img
            src={resource.thumbnailUrl}
            alt={resource.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Description */}
      {resource.description && (
        <div className="bg-[#00084D]/40 border border-white/[0.08] rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-[#FCFCFC] mb-3">About this resource</h2>
          <p className="text-white/60 text-sm leading-relaxed whitespace-pre-wrap">
            {resource.description}
          </p>
        </div>
      )}
    </div>
  );
};
