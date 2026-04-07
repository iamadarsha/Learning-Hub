import { UserAvatar } from "@/components/user-avatar";
import Link from "next/link";

const TYPE_COLORS: Record<string, string> = {
  tutorial: "bg-[#009BFF]/20 text-[#009BFF]",
  tool: "bg-[#770BFF]/20 text-[#770BFF]",
  doc: "bg-[#4CC3AE]/20 text-[#4CC3AE]",
  template: "bg-orange-500/20 text-orange-400",
  video: "bg-[#009BFF]/20 text-[#009BFF]",
};

interface ResourceCardProps {
  id: string;
  title: string;
  description?: string | null;
  type: string;
  thumbnailUrl?: string | null;
  xpValue: number;
  viewCount: number;
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
  description,
  type,
  thumbnailUrl,
  xpValue,
  viewCount,
  author,
  category,
}: ResourceCardProps) => {
  return (
    <Link href={`/resources/${id}`} prefetch>
      <div className="group bg-[#00084D]/60 border border-white/[0.08] rounded-2xl p-5 hover:border-[#009BFF] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer h-full flex flex-col">
        {/* Thumbnail */}
        {thumbnailUrl ? (
          <div className="aspect-video rounded-xl overflow-hidden mb-4 bg-[#00084D]">
            <img
              src={thumbnailUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="aspect-video rounded-xl mb-4 bg-gradient-to-br from-[#00084D] to-[#009BFF]/20 flex items-center justify-center">
            <span className="text-3xl opacity-40">
              {type === "video" ? "▶" : type === "doc" ? "📄" : type === "tool" ? "🔧" : type === "template" ? "📋" : "📚"}
            </span>
          </div>
        )}

        {/* Type badge + XP */}
        <div className="flex items-center justify-between mb-3">
          <span
            className={`text-xs font-medium px-2.5 py-0.5 rounded-full capitalize ${TYPE_COLORS[type] || TYPE_COLORS.doc}`}
          >
            {type}
          </span>
          <span className="text-xs font-medium text-[#009BFF] bg-[#009BFF]/10 px-2 py-0.5 rounded-full">
            +{xpValue} XP
          </span>
        </div>

        {/* Title */}
        <h3 className="text-[#FCFCFC] font-bold text-base leading-tight mb-2 line-clamp-2 group-hover:text-[#009BFF] transition-colors">
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-white/40 text-sm line-clamp-2 mb-3 flex-1">{description}</p>
        )}

        {/* Author + Views */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/[0.06]">
          {author && (
            <div className="flex items-center gap-2">
              <UserAvatar imageUrl={author.imageUrl} name={author.name} size="xs" />
              <span className="text-xs text-white/50">{author.name}</span>
            </div>
          )}
          <span className="text-xs text-white/30">
            {viewCount} {viewCount === 1 ? "view" : "views"}
          </span>
        </div>
      </div>
    </Link>
  );
};
