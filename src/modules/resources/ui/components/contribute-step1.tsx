"use client";

import { useState, useEffect } from "react";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import {
  VideoIcon,
  BookOpenIcon,
  FileTextIcon,
  WrenchIcon,
  LayoutTemplateIcon,
  Loader2Icon,
} from "lucide-react";

const RESOURCE_TYPES = [
  { value: "video" as const, label: "Video", icon: VideoIcon },
  { value: "tutorial" as const, label: "Tutorial", icon: BookOpenIcon },
  { value: "doc" as const, label: "Document", icon: FileTextIcon },
  { value: "tool" as const, label: "Tool", icon: WrenchIcon },
  { value: "template" as const, label: "Template", icon: LayoutTemplateIcon },
];

interface ContributeStep1Props {
  initialValues?: {
    title: string;
    url: string;
    type: string;
  };
  onComplete: (data: {
    resourceId: string;
    title: string;
    url: string;
    type: string;
  }) => void;
}

export function ContributeStep1({ initialValues, onComplete }: ContributeStep1Props) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [url, setUrl] = useState(initialValues?.url ?? "");
  const [type, setType] = useState<"video" | "tutorial" | "doc" | "tool" | "template" | null>(
    (initialValues?.type as "video" | "tutorial" | "doc" | "tool" | "template") ?? null
  );

  useEffect(() => {
    if (initialValues?.title) setTitle(initialValues.title);
    if (initialValues?.url) setUrl(initialValues.url);
    if (initialValues?.type) setType(initialValues.type as "video" | "tutorial" | "doc" | "tool" | "template");
  }, [initialValues?.title, initialValues?.url, initialValues?.type]);

  const trpc = useTRPC();
  const createDraft = useMutation(trpc.resources.createDraft.mutationOptions());

  const isValid = title.trim().length >= 3 && url.trim().length > 0 && type !== null;

  const handleNext = async () => {
    if (!isValid || !type) return;

    const resource = await createDraft.mutateAsync({
      title: title.trim(),
      url: url.trim(),
      type,
    });

    onComplete({
      resourceId: resource.id,
      title: title.trim(),
      url: url.trim(),
      type,
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">Add a resource</h2>
        <p className="text-white/50 mt-1 text-sm">
          Share something useful with your team
        </p>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-white/70">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. How to build an n8n workflow"
          className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/30 focus:outline-none focus:border-[#009BFF] transition-colors"
        />
      </div>

      {/* Resource URL */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-white/70">
          Resource URL
        </label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://drive.google.com/..."
          className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/30 focus:outline-none focus:border-[#009BFF] transition-colors"
        />
        <p className="text-xs text-white/30">
          Google Drive links will be auto-processed
        </p>
      </div>

      {/* Resource Type */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-white/70">
          Resource Type
        </label>
        <div className="grid grid-cols-5 gap-3">
          {RESOURCE_TYPES.map((rt) => {
            const isSelected = type === rt.value;
            return (
              <button
                key={rt.value}
                type="button"
                onClick={() => setType(rt.value)}
                className={`
                  flex flex-col items-center gap-2 py-4 px-2 rounded-xl border transition-all cursor-pointer
                  ${isSelected
                    ? "bg-[#009BFF] border-[#009BFF] text-white"
                    : "bg-white/[0.04] border-white/[0.08] text-white/50 hover:border-white/20"
                  }
                `}
              >
                <rt.icon className="size-5" />
                <span className="text-xs font-medium">{rt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={handleNext}
        disabled={!isValid || createDraft.isPending}
        className="px-8 py-3 bg-[#009BFF] hover:bg-[#009BFF]/90 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium rounded-full transition-all flex items-center gap-2"
      >
        {createDraft.isPending && <Loader2Icon className="size-4 animate-spin" />}
        Next &rarr;
      </button>

      {createDraft.isError && (
        <p className="text-red-400 text-sm">
          Failed to create draft. Please try again.
        </p>
      )}
    </div>
  );
}
