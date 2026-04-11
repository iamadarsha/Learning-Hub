"use client";

import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { getDriveEmbedUrl } from "@/lib/drive";
import { THUMBNAIL_PALETTES } from "@/lib/thumbnail";
import { Loader2Icon, ExternalLinkIcon } from "lucide-react";

type ThumbnailData =
  | { type: "preset"; paletteIndex: number }
  | { type: "upload"; url: string };

type StepData = {
  resourceId?: string;
  title?: string;
  url?: string;
  type?: string;
  categoryId?: string;
  description?: string;
  attachments?: string[];
  transcriptionStatus?: string;
  thumbnailData?: ThumbnailData;
};

interface ContributeStep3Props {
  stepData: StepData;
  onComplete: () => void;
  onBack: () => void;
}

export function ContributeStep3({ stepData, onComplete, onBack }: ContributeStep3Props) {
  const trpc = useTRPC();

  const { data: categoriesData } = useSuspenseQuery(
    trpc.categories.getMany.queryOptions()
  );

  const { data: transcription } = useQuery({
    ...trpc.resources.getTranscriptionStatus.queryOptions({
      resourceId: stepData.resourceId!,
    }),
    enabled: !!stepData.resourceId,
  });

  const publish = useMutation(trpc.resources.publishResource.mutationOptions());

  const category = categoriesData?.find((c) => c.id === stepData.categoryId);
  const embedUrl = stepData.url ? getDriveEmbedUrl(stepData.url) : null;
  const hasTranscription = transcription?.status === "completed" && transcription.data;

  // Compute thumbnailUrl for DB storage
  const thumbnailUrlForDB = stepData.thumbnailData?.type === "preset"
    ? `preset:${stepData.thumbnailData.paletteIndex}`
    : stepData.thumbnailData?.type === "upload"
      ? stepData.thumbnailData.url
      : undefined;

  const handleSubmit = async () => {
    if (!stepData.resourceId || !stepData.categoryId) return;

    await publish.mutateAsync({
      resourceId: stepData.resourceId,
      categoryId: stepData.categoryId,
      description: stepData.description,
      attachments: stepData.attachments,
      thumbnailUrl: thumbnailUrlForDB,
    });

    onComplete();
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">Review & Submit</h2>
        <p className="text-white/50 mt-1 text-sm">
          Preview your resource before publishing
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-3 space-y-5">
          {/* Video preview */}
          {embedUrl && (
            <iframe
              src={embedUrl}
              className="w-full aspect-video rounded-xl border border-white/[0.08]"
              allow="autoplay"
              allowFullScreen
            />
          )}

          {/* Thumbnail preview */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/50 uppercase tracking-wide">
                Your thumbnail
              </span>
              <button type="button" onClick={onBack} className="text-xs text-[#009BFF] hover:underline">
                Change
              </button>
            </div>
            {stepData.thumbnailData?.type === "upload" ? (
              <img
                src={stepData.thumbnailData.url}
                alt="Thumbnail preview"
                className="w-full aspect-video rounded-lg object-cover"
              />
            ) : (
              (() => {
                const index = stepData.thumbnailData?.type === "preset" ? stepData.thumbnailData.paletteIndex : 0;
                const palette = THUMBNAIL_PALETTES[index];
                return (
                  <div
                    className="w-full aspect-video rounded-lg flex items-center justify-center p-4"
                    style={{ backgroundColor: palette.bg }}
                  >
                    <span
                      className="font-bold text-center text-sm leading-tight line-clamp-2"
                      style={{ color: palette.text }}
                    >
                      {stepData.title || "Resource title"}
                    </span>
                  </div>
                );
              })()
            )}
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-white">{stepData.title}</h3>

          {/* Metadata row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#009BFF]/10 border border-[#009BFF]/30 text-[#009BFF] text-xs font-medium capitalize">
              {stepData.type}
            </span>
            {category && (
              <span
                className="px-3 py-1 rounded-full text-xs font-medium border"
                style={{
                  borderColor: `${category.color}40`,
                  color: category.color ?? "#009BFF",
                  backgroundColor: `${category.color}15`,
                }}
              >
                {category.name}
              </span>
            )}
            <span className="text-xs text-white/30">0 views</span>
            <span className="px-2 py-0.5 rounded-full bg-[#4CC3AE]/10 border border-[#4CC3AE]/30 text-[#4CC3AE] text-xs font-semibold">
              +25 XP
            </span>
          </div>

          {/* Description */}
          {stepData.description && (
            <div>
              <p className="text-xs text-white/40 uppercase tracking-wider mb-1">
                Description
              </p>
              <p className="text-sm text-white/70">{stepData.description}</p>
            </div>
          )}

          {/* Attachments */}
          {stepData.attachments && stepData.attachments.length > 0 && (
            <div>
              <p className="text-xs text-white/40 uppercase tracking-wider mb-2">
                Attachments
              </p>
              <div className="flex flex-wrap gap-2">
                {stepData.attachments.map((link, idx) => (
                  <a
                    key={idx}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-[#009BFF] hover:border-[#009BFF]/30 transition-colors"
                  >
                    <span className="max-w-[180px] truncate">{link}</span>
                    <ExternalLinkIcon className="size-3" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN — Transcription */}
        <div className="lg:col-span-2 space-y-4">
          {hasTranscription ? (
            <>
              {/* Mission Control */}
              <div className="rounded-xl p-5 bg-[#00084D]/80 border border-[#009BFF]/30">
                <p className="text-[10px] text-[#4CC3AE] font-mono tracking-widest uppercase mb-3">
                  CORE_INTEL // DETAILED_SUMMARY
                </p>
                <p className="text-sm text-white leading-relaxed">
                  {transcription.data!.missionControl.summary}
                </p>
              </div>

              {/* Steps */}
              {transcription.data!.steps.length > 0 && (
                <div className="rounded-xl p-5 bg-[#00084D]/80 border border-[#770BFF]/30">
                  <p className="text-[10px] text-[#770BFF] font-mono tracking-widest uppercase mb-4">
                    EXECUTION_PROTOCOL // STEP_BY_STEP
                  </p>
                  <div className="space-y-4">
                    {transcription.data!.steps.map(
                      (step: { number: number; title: string; description: string; isKeyStep: boolean; actionTags?: string[] }, idx: number) => (
                        <div key={step.number}>
                          {idx > 0 && (
                            <div className="border-t border-white/[0.06] mb-4" />
                          )}
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] text-[#4CC3AE] font-mono">
                                STEP {step.number}
                              </span>
                              {step.isKeyStep && (
                                <span className="px-2 py-0.5 rounded-full border border-pink-400/40 text-pink-400 text-[10px] font-mono">
                                  KEY STEP
                                </span>
                              )}
                            </div>
                            <p className="text-[15px] font-semibold text-white">
                              {step.title}
                            </p>
                            <p className="text-sm text-white/60">
                              {step.description}
                            </p>
                            {step.actionTags && step.actionTags.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                {step.actionTags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="px-2 py-0.5 rounded bg-white/[0.06] text-[11px] text-white/50 font-mono"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Topic tags */}
              {transcription.data!.missionControl.tags.length > 0 && (
                <div>
                  <p className="text-[10px] text-white/40 font-mono tracking-widest uppercase mb-2">
                    TOPIC MATRIX
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {transcription.data!.missionControl.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full border border-[#4CC3AE]/30 text-[#4CC3AE] text-xs font-mono"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : transcription?.status === "failed" ? (
            <div className="rounded-xl p-5 bg-white/[0.02] border border-white/[0.06]">
              <p className="text-sm text-white/40 text-center">
                AI summary unavailable for this resource
              </p>
            </div>
          ) : null}
        </div>
      </div>

      {/* Bottom CTAs */}
      <div className="space-y-3 pt-4">
        <button
          onClick={handleSubmit}
          disabled={publish.isPending}
          className="w-full py-3.5 rounded-full font-semibold text-white transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          style={{
            background: "linear-gradient(135deg, #009BFF, #770BFF)",
          }}
        >
          {publish.isPending ? (
            <>
              <Loader2Icon className="size-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Resource"
          )}
        </button>

        <button
          onClick={onBack}
          className="text-sm text-white/40 hover:text-white/70 transition-colors"
        >
          &larr; Back
        </button>

        {publish.isError && (
          <p className="text-red-400 text-sm">
            Failed to publish. Please try again.
          </p>
        )}
      </div>
    </div>
  );
}
