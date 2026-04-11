"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ContributeStepper } from "@/modules/resources/ui/components/contribute-stepper";
import { ContributeStep1 } from "@/modules/resources/ui/components/contribute-step1";
import { ContributeStep2 } from "@/modules/resources/ui/components/contribute-step2";
import { ContributeStep3 } from "@/modules/resources/ui/components/contribute-step3";
import { ContributeStep4 } from "@/modules/resources/ui/components/contribute-step4";

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
  thumbnailUrl?: string;
};

export default function ContributePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [stepData, setStepData] = useState<StepData>({});
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const editResourceId = searchParams.get("resourceId");

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data: existingResource, isLoading: isLoadingResource } = useQuery({
    ...trpc.resources.getOne.queryOptions({ id: editResourceId! }),
    enabled: !!editResourceId,
  });

  const { mutate: deleteDraft } = useMutation(
    trpc.resources.deleteDraft.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.studio.getMany.infiniteQueryOptions({ limit: 5 }));
        if (pendingNavigation) router.push(pendingNavigation);
      },
    })
  );

  useEffect(() => {
    if (existingResource) {
      setStepData({
        resourceId: existingResource.resource.id,
        title: existingResource.resource.title ?? "",
        url: existingResource.resource.url ?? "",
        type: existingResource.resource.type ?? "video",
        categoryId: existingResource.resource.categoryId ?? undefined,
        description: existingResource.resource.description ?? undefined,
        thumbnailUrl: existingResource.resource.thumbnailUrl ?? undefined,
        transcriptionStatus: existingResource.resource.transcriptionStatus ?? undefined,
      });
    }
  }, [existingResource]);

  const hasDraft = !!stepData.resourceId && currentStep < 4;

  const handleNavAttempt = (href: string) => {
    if (hasDraft) {
      setPendingNavigation(href);
      setShowDiscardModal(true);
    } else {
      router.push(href);
    }
  };

  const handleDiscard = () => {
    if (stepData.resourceId) {
      deleteDraft({ resourceId: stepData.resourceId });
    } else if (pendingNavigation) {
      router.push(pendingNavigation);
    }
    setShowDiscardModal(false);
  };

  // Intercept sidebar/layout link clicks when a draft exists
  useEffect(() => {
    if (!hasDraft) return;

    const handleLinkClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      if (anchor.target === "_blank") return;
      const href = anchor.getAttribute("href");
      if (!href || !href.startsWith("/")) return;
      if (href === "/studio/contribute" || href.startsWith("/studio/contribute?")) return;
      e.preventDefault();
      e.stopPropagation();
      setPendingNavigation(href);
      setShowDiscardModal(true);
    };

    document.addEventListener("click", handleLinkClick, true);
    return () => document.removeEventListener("click", handleLinkClick, true);
  }, [hasDraft]);

  // Intercept browser back button
  useEffect(() => {
    if (!hasDraft) return;

    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
      setPendingNavigation(null);
      setShowDiscardModal(true);
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [hasDraft]);

  const updateStepData = (data: Partial<StepData>) => {
    setStepData((prev) => ({ ...prev, ...data }));
  };

  if (editResourceId && isLoadingResource) {
    return (
      <div className="min-h-screen bg-[#090A0F] flex items-center justify-center">
        <p className="text-white/40 text-sm">Loading resource...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090A0F] px-6 py-8 max-w-4xl mx-auto">
      <ContributeStepper currentStep={currentStep} />
      <div className="mt-10">
        {currentStep === 1 && (
          <ContributeStep1
            initialValues={
              stepData.title
                ? {
                    title: stepData.title,
                    url: stepData.url ?? "",
                    type: stepData.type ?? "video",
                  }
                : undefined
            }
            onComplete={(data) => {
              updateStepData(data);
              setCurrentStep(2);
            }}
          />
        )}
        {currentStep === 2 && (
          <Suspense
            fallback={
              <div className="text-white/40 text-center py-12">Loading...</div>
            }
          >
            <ContributeStep2
              resourceId={stepData.resourceId!}
              title={stepData.title}
              initialValues={{
                categoryId: stepData.categoryId,
                description: stepData.description,
                attachments: stepData.attachments,
                thumbnailData: stepData.thumbnailData,
              }}
              onBack={() => setCurrentStep(1)}
              onComplete={(data) => {
                updateStepData(data);
                setCurrentStep(3);
              }}
            />
          </Suspense>
        )}
        {currentStep === 3 && (
          <Suspense
            fallback={
              <div className="text-white/40 text-center py-12">Loading...</div>
            }
          >
            <ContributeStep3
              stepData={stepData}
              onComplete={() => setCurrentStep(4)}
              onBack={() => setCurrentStep(2)}
            />
          </Suspense>
        )}
        {currentStep === 4 && (
          <ContributeStep4
            onReset={() => {
              setStepData({});
              setCurrentStep(1);
            }}
          />
        )}
      </div>

      {/* Discard draft modal */}
      {showDiscardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowDiscardModal(false)}
          />
          <div className="relative z-10 w-full max-w-md mx-4 bg-[#00084D] border border-white/10 rounded-2xl p-6">
            <h2 className="text-white font-semibold text-base mb-2">
              You have an unfinished resource.
            </h2>
            <p className="text-white/50 text-sm mb-6">
              If you leave now, it will be discarded.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowDiscardModal(false)}
                className="flex-1 py-2.5 rounded-full border border-white/20 text-white/60 hover:text-white hover:border-white/40 text-sm transition-colors"
              >
                Continue editing
              </button>
              <button
                onClick={handleDiscard}
                className="flex-1 py-2.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 text-sm transition-colors"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
