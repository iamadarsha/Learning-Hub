import { StarIcon } from "lucide-react";

const Page = () => {
  return (
    <div className="max-w-4xl mx-auto mb-10 px-4 pt-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-[#FFA500]/10 flex items-center justify-center">
          <StarIcon className="size-5 text-[#FFA500]" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-[#FCFCFC]">Favorites</h1>
          <p className="text-white/40 text-sm">Your top-rated resources</p>
        </div>
      </div>

      <div className="text-center py-20">
        <div className="w-16 h-16 rounded-2xl bg-[#FFA500]/10 flex items-center justify-center mx-auto mb-4">
          <StarIcon className="size-8 text-[#FFA500]" />
        </div>
        <p className="text-white/40 text-lg">No favorites yet</p>
        <p className="text-white/20 text-sm mt-2">Star resources you love to keep them here</p>
        <p className="text-white/10 text-xs mt-4 italic">Coming in MVP2</p>
      </div>
    </div>
  );
};

export default Page;
