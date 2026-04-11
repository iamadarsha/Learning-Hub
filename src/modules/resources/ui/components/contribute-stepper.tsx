"use client";

import { CheckIcon } from "lucide-react";

const STEPS = [
  { number: 1, label: "Resource basics" },
  { number: 2, label: "Processing" },
  { number: 3, label: "Review" },
  { number: 4, label: "Done" },
];

interface ContributeStepperProps {
  currentStep: number;
}

export function ContributeStepper({ currentStep }: ContributeStepperProps) {
  return (
    <div className="flex items-center justify-between w-full max-w-2xl mx-auto">
      {STEPS.map((step, idx) => {
        const isCompleted = currentStep > step.number;
        const isCurrent = currentStep === step.number;

        return (
          <div key={step.number} className="flex items-center flex-1 last:flex-none">
            {/* Step circle + label */}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`
                  size-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all
                  ${isCompleted
                    ? "bg-[#4CC3AE] text-white"
                    : isCurrent
                      ? "bg-[#009BFF] text-white"
                      : "border-2 border-white/20 text-white/40"
                  }
                `}
              >
                {isCompleted ? (
                  <CheckIcon className="size-4" />
                ) : (
                  step.number
                )}
              </div>
              <span
                className={`text-xs whitespace-nowrap ${
                  isCurrent
                    ? "text-white font-semibold"
                    : isCompleted
                      ? "text-[#4CC3AE]"
                      : "text-white/40"
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connecting line */}
            {idx < STEPS.length - 1 && (
              <div className="flex-1 mx-3 mt-[-18px]">
                <div
                  className={`h-[2px] w-full ${
                    currentStep > step.number ? "bg-[#4CC3AE]" : "bg-white/10"
                  }`}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
