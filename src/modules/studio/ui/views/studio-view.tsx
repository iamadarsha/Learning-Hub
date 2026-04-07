import { ResourcesSection } from "../sections/resources-section";

export const StudioView = () => {
  return (
    <div className="flex flex-col gap-y-6 pt-2.5">
      <div className="px-4">
        <h1 className="text-2xl font-bold text-[#FCFCFC]">Contributor Dashboard</h1>
        <p className="text-xs text-white/40">Manage your shared knowledge resources</p>
      </div>
      <ResourcesSection />
    </div>
  );
};
