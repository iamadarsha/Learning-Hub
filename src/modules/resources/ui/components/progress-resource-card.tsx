"use client";

import Link from "next/link";
import { PlayIcon } from "lucide-react";
import { getThumbnailPalette } from "@/lib/thumbnail";

const TYPE_COLORS: Record<string, string> = {
  tutorial: "bg-[#009BFF]/20 text-[#009BFF]",
  video: "bg-[#009BFF]/20 text-[#009BFF]",
  tool: "bg-[#770BFF]/20 text-[#770BFF]",
  doc: "bg-[#4CC3AE]/20 text-[#4CC3AE]",
  template: "bg-orange-500/20 text-orange-400",
};

interface ProgressResourceCardProps {
  id: string;
  title: string;
  type: string;
  thumbnailUrl?: string | null;
  authorName?: string | null;
  duration?: string;
  progress: number; // 0–100
}

export const ProgressResourceCard = ({
  id,
  title,
  type,
  thumbnailUrl,
  authorName,
  duration,
  progress,
}: ProgressResourceCardProps) => {
  const palette = getThumbnailPalette(thumbnailUrl);

  return (
    <Link href={`/resources/${id}`} prefetch>
      <div className="group flex-shrink-0 w-[280px] sm:w-[300px] bg-[#00084D]/60 border border-white/[0.08] rounded-2xl overflow-hidden hover:border-[#009BFF] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
        {/* Thumbnail with play overlay */}
        <div className="relative aspect-video bg-gradient-to-br from-[#00084D] to-[#009BFF]/20">
          {palette ? (
            <div
              className="w-full h-full flex items-center justify-center p-3"
              style={{ backgroundColor: palette.bg }}
            >
              <span
                className="font-bold text-center text-sm leading-tight line-clamp-2"
                style={{ color: palette.text }}
              >
                {title}
              </span>
            </div>
          ) : thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-3xl opacity-30">
                {type === "video" ? "▶" : "📚"}
              </span>
            </div>
          )}

          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
            <div className="w-12 h-12 rounded-full bg-[#009BFF] flex items-center justify-center">
              <PlayIcon className="size-5 text-white ml-0.5" fill="white" />
            </div>
          </div>

          {/* Duration badge */}
          {duration && (
            <span className="absolute bottom-2 right-2 text-[10px] font-medium bg-black/70 text-white px-1.5 py-0.5 rounded">
              {duration}
            </span>
          )}

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
            <div
              className="h-full bg-[#009BFF] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Info */}
        <div className="p-3.5">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`text-[10px] font-medium px-2 py-0.5 rounded-full capitalize ${TYPE_COLORS[type] || TYPE_COLORS.doc}`}
            >
              {type}
            </span>
            <span className="text-[10px] text-white/30">{progress}% complete</span>
          </div>
          <h4 className="text-sm font-semibold text-[#FCFCFC] line-clamp-2 leading-tight group-hover:text-[#009BFF] transition-colors">
            {title}
          </h4>
          {authorName && (
            <p className="text-xs text-white/40 mt-1.5">{authorName}</p>
          )}
        </div>
      </div>
    </Link>
  );
};
