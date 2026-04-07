import { UserAvatar } from "@/components/user-avatar";
import { CheckCircle2Icon } from "lucide-react";

interface ExpertCardProps {
  displayName: string;
  role?: string | null;
  team?: string | null;
  skills?: string[] | null;
  bio?: string | null;
  resourceCount: number;
  isVerified: boolean;
  imageUrl?: string;
}

export const ExpertCard = ({
  displayName,
  role,
  team,
  skills,
  bio,
  resourceCount,
  isVerified,
  imageUrl,
}: ExpertCardProps) => {
  return (
    <div className="bg-[#00084D] border border-white/[0.1] rounded-2xl p-6 hover:border-[#009BFF] hover:-translate-y-0.5 transition-all duration-200 flex flex-col items-center text-center">
      {/* Avatar */}
      <div className="relative mb-4">
        <UserAvatar
          imageUrl={imageUrl || ""}
          name={displayName}
          size="lg"
          className="size-12"
        />
        {isVerified && (
          <CheckCircle2Icon className="absolute -bottom-0.5 -right-0.5 size-5 text-[#009BFF] bg-[#00084D] rounded-full" />
        )}
      </div>

      {/* Name */}
      <h3 className="text-[#FCFCFC] font-bold text-base mb-1">{displayName}</h3>

      {/* Role + Team */}
      <p className="text-white/50 text-xs mb-3">
        {role && <span>{role}</span>}
        {role && team && <span> · </span>}
        {team && <span>{team}</span>}
      </p>

      {/* Skills */}
      {skills && skills.length > 0 && (
        <div className="flex flex-wrap justify-center gap-1.5 mb-4">
          {skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="text-xs px-2.5 py-0.5 rounded-full border border-[#009BFF]/30 text-[#009BFF]"
            >
              {skill}
            </span>
          ))}
          {skills.length > 4 && (
            <span className="text-xs px-2 py-0.5 text-white/30">
              +{skills.length - 4}
            </span>
          )}
        </div>
      )}

      {/* Resource count */}
      <p className="text-white/40 text-xs mb-4">
        {resourceCount} resource{resourceCount !== 1 ? "s" : ""} shared
      </p>

      {/* Connect button */}
      <button className="px-5 py-1.5 text-sm border border-[#009BFF]/40 text-[#009BFF] rounded-full hover:bg-[#009BFF]/10 transition-colors">
        Connect
      </button>
    </div>
  );
};
