"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
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

  const searchParams = useSearchParams();
  const editResourceId = searchParams.get("resourceId");

  const trpc = useTRPC();
  const { data: existingResource, isLoading: isLoadingResource } = useQuery({
    ...trpc.resources.getOne.queryOptions({ id: editResourceId! }),
    enabled: !!editResourceId,
  });

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
    </div>
  );
}
