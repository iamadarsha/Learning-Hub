"use client";

import { ResourcesSection } from "@/modules/studio/ui/sections/resources-section";

export const StudioResourcesView = () => {
  return (
    <div className="flex flex-col gap-y-6 pt-2.5">
      <div className="px-4">
        <h1 className="text-2xl font-bold text-[#FCFCFC]">My Resources</h1>
        <p className="text-xs text-white/40">All resources you&apos;ve submitted</p>
      </div>
      <ResourcesSection />
    </div>
  );
};
