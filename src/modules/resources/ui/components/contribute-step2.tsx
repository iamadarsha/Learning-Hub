"use client";

import { useState } from "react";
import { useTRPC } from "@/trpc/client";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import {
  Loader2Icon,
  CheckCircle2Icon,
  XCircleIcon,
  PlusIcon,
  XIcon,
} from "lucide-react";
import { ThumbnailPicker } from "./thumbnail-picker";

type ThumbnailData =
  | { type: "preset"; paletteIndex: number }
  | { type: "upload"; url: string };

interface ContributeStep2Props {
  resourceId: string;
  title?: string;
  onComplete: (data: {
    categoryId: string;
    description?: string;
    attachments?: string[];
    transcriptionStatus: string;
    thumbnailData: ThumbnailData;
  }) => void;
}

export function ContributeStep2({ resourceId, title, onComplete }: ContributeStep2Props) {
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState<string[]>([]);
  const [attachmentInput, setAttachmentInput] = useState("");
  const [thumbnailData, setThumbnailData] = useState<ThumbnailData>({
    type: "preset",
    paletteIndex: 0,
  });

  const trpc = useTRPC();

  // Poll transcription status
  const { data: transcription } = useQuery({
    ...trpc.resources.getTranscriptionStatus.queryOptions({ resourceId }),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === "completed" || status === "failed") return false;
      return 3000;
    },
  });

  const status = transcription?.status ?? "processing";

  // Categories
  const { data: categoriesData } = useSuspenseQuery(
    trpc.categories.getMany.queryOptions()
  );

  const addAttachment = () => {
    const trimmed = attachmentInput.trim();
    if (trimmed && attachments.length < 3) {
      try {
        new URL(trimmed);
        setAttachments([...attachments, trimmed]);
        setAttachmentInput("");
      } catch {
        // invalid URL, ignore
      }
    }
  };

  const removeAttachment = (idx: number) => {
    setAttachments(attachments.filter((_, i) => i !== idx));
  };

  const canProceed = status !== "pending" && categoryId !== "";

  const handleNext = () => {
    onComplete({
      categoryId,
      description: description.trim() || undefined,
      attachments: attachments.length > 0 ? attachments : undefined,
      transcriptionStatus: status,
      thumbnailData,
    });
  };

  return (
    <div className="space-y-8">
      {/* Processing banner */}
      <div
        className={`rounded-xl p-5 border transition-all ${
          status === "completed"
            ? "bg-[#4CC3AE]/[0.08] border-[#4CC3AE]/20"
            : status === "failed"
              ? "bg-red-500/[0.08] border-red-500/20"
              : "bg-[#009BFF]/[0.08] border-[#009BFF]/20"
        }`}
      >
        <div className="flex items-center gap-4">
          {status === "completed" ? (
            <CheckCircle2Icon className="size-6 text-[#4CC3AE] shrink-0" />
          ) : status === "failed" ? (
            <XCircleIcon className="size-6 text-red-400 shrink-0" />
          ) : (
            <Loader2Icon className="size-6 text-[#009BFF] animate-spin shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold">
              {status === "completed"
                ? "Processing complete!"
                : status === "failed"
                  ? "Processing failed"
                  : "Processing your video..."}
            </p>
            <p className="text-sm text-white/50 mt-0.5">
              {status === "completed"
                ? "Your summary is ready to review"
                : status === "failed"
                  ? "You can still submit \u2014 the summary won\u2019t be available"
                  : "Extracting key steps and generating summary"}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-1.5 rounded-full overflow-hidden bg-white/[0.06]">
          {status === "completed" ? (
            <div className="h-full w-full bg-[#4CC3AE] rounded-full" />
          ) : status === "failed" ? (
            <div className="h-full w-full bg-red-400/50 rounded-full" />
          ) : (
            <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-[#009BFF] to-[#770BFF] animate-shimmer" />
          )}
        </div>

        {status === "failed" && (
          <button
            onClick={handleNext}
            className="mt-3 text-sm text-white/70 hover:text-white underline"
          >
            Continue anyway &rarr;
          </button>
        )}
      </div>

      {/* Thumbnail picker */}
      <ThumbnailPicker title={title ?? ""} onSelect={setThumbnailData} />

      {/* Details form */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-white">Details</h3>

        {/* Category */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/70">
            Category <span className="text-red-400">*</span>
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white focus:outline-none focus:border-[#009BFF] transition-colors appearance-none"
          >
            <option value="" className="bg-[#090A0F]">
              Select a category
            </option>
            {categoriesData?.map((cat) => (
              <option key={cat.id} value={cat.id} className="bg-[#090A0F]">
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/70">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What will people learn from this?"
            rows={3}
            maxLength={500}
            className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/30 focus:outline-none focus:border-[#009BFF] transition-colors resize-none"
          />
        </div>

        {/* Attachments */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/70">
            Attachments <span className="text-white/30">(up to 3 links)</span>
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={attachmentInput}
              onChange={(e) => setAttachmentInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAttachment())}
              placeholder="https://..."
              disabled={attachments.length >= 3}
              className="flex-1 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/30 focus:outline-none focus:border-[#009BFF] transition-colors disabled:opacity-40"
            />
            <button
              type="button"
              onClick={addAttachment}
              disabled={attachments.length >= 3 || !attachmentInput.trim()}
              className="px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.1] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <PlusIcon className="size-4" />
            </button>
          </div>
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {attachments.map((link, idx) => (
                <span
                  key={idx}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-xs text-white/70"
                >
                  <span className="max-w-[200px] truncate">{link}</span>
                  <button
                    type="button"
                    onClick={() => removeAttachment(idx)}
                    className="text-white/40 hover:text-white"
                  >
                    <XIcon className="size-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={handleNext}
        disabled={!canProceed}
        className="px-8 py-3 bg-[#009BFF] hover:bg-[#009BFF]/90 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium rounded-full transition-all"
      >
        Next &rarr;
      </button>
    </div>
  );
}
