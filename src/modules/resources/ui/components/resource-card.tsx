import { getThumbnailPalette } from "@/lib/thumbnail";
import { HeartIcon } from "lucide-react";
import Link from "next/link";

interface ResourceCardProps {
  id: string;
  title: string;
  description?: string | null;
  type: string;
  thumbnailUrl?: string | null;
  xpValue: number;
  viewCount: number;
  likeCount?: number | null;
  author?: {
    name: string;
    imageUrl: string;
  } | null;
  category?: {
    name: string;
    color?: string | null;
  } | null;
}

export const ResourceCard = ({
  id,
  title,
  type,
  thumbnailUrl,
  viewCount,
  likeCount,
  author,
}: ResourceCardProps) => {
  const palette = getThumbnailPalette(thumbnailUrl);

  return (
    <Link href={`/resources/${id}`} prefetch>
      <div className="group bg-[#00084D]/60 border border-white/[0.08] rounded-2xl hover:border-[#009BFF] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer h-full flex flex-col overflow-hidden">
        {/* Thumbnail */}
        {palette ? (
          <div
            className="w-full aspect-video flex items-center justify-center p-3"
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
            className="w-full aspect-video object-cover"
          />
        ) : (
          <div className="w-full aspect-video bg-gradient-to-br from-[#00084D] to-[#009BFF]/20 flex items-center justify-center">
            <span className="text-white/20 text-xs">No thumbnail</span>
          </div>
        )}

        {/* Card bottom */}
        <div className="p-4 flex flex-col gap-3">
          {/* Row 1: Type badge left, Likes right */}
          <div className="flex items-center justify-between">
            <span className="text-xs px-2.5 py-1 rounded-full bg-white/10 text-white/70 font-medium capitalize">
              {type}
            </span>
            <span className="flex items-center gap-1 text-xs text-white/50">
              <HeartIcon size={11} fill="currentColor" className="text-red-400" />
              {likeCount ?? 0}
            </span>
          </div>

          {/* Title */}
          <p className="text-white font-semibold text-sm leading-snug line-clamp-2 group-hover:text-[#009BFF] transition-colors">
            {title}
          </p>

          {/* Row 2: Avatar + name left, Views right */}
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#009BFF]/20 flex items-center justify-center text-[10px] text-[#009BFF] font-bold uppercase">
                {author?.name?.[0] ?? "?"}
              </div>
              <span className="text-white/50 text-xs">{author?.name}</span>
            </div>
            <span className="text-white/30 text-xs">
              {viewCount ?? 0} {viewCount === 1 ? "view" : "views"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
