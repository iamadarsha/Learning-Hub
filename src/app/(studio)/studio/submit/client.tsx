"use client";

import { useTRPC } from "@/trpc/client";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { UploadIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const RESOURCE_TYPES = [
  { value: "video", label: "Video", icon: "▶" },
  { value: "tutorial", label: "Tutorial", icon: "📚" },
  { value: "doc", label: "Document", icon: "📄" },
  { value: "tool", label: "Tool", icon: "🔧" },
  { value: "template", label: "Template", icon: "📋" },
] as const;

export const SubmitResourceView = () => {
  const router = useRouter();
  const trpc = useTRPC();
  const { data: categories } = useSuspenseQuery(trpc.categories.getMany.queryOptions());

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<string>("tutorial");
  const [url, setUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");

  const createResource = useMutation(
    trpc.resources.create.mutationOptions({
      onSuccess: () => {
        toast.success("Resource submitted! +25 XP", {
          description: "Your resource is now live on Hyvmind.",
        });
        router.push("/studio");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createResource.mutate({
      title,
      description: description || undefined,
      type: type as "video" | "doc" | "tutorial" | "tool" | "template",
      url: url || undefined,
      thumbnailUrl: thumbnailUrl || undefined,
      categoryId: categoryId || undefined,
    });
  };

  return (
    <div className="max-w-2xl mx-auto pt-6 px-4 pb-12">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-[#009BFF]/10 flex items-center justify-center">
          <UploadIcon className="size-5 text-[#009BFF]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#FCFCFC]">Submit a Resource</h1>
          <p className="text-sm text-white/40">Share knowledge with the team and earn XP</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-[#FCFCFC] mb-2">
            Title <span className="text-[#009BFF]">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="e.g. How to build your first n8n workflow"
            className="w-full px-4 py-3 bg-[#00084D]/40 border border-white/[0.08] rounded-xl text-[#FCFCFC] placeholder:text-white/30 focus:outline-none focus:border-[#009BFF] focus:ring-1 focus:ring-[#009BFF]/30 transition-all"
          />
        </div>

        {/* Resource Type */}
        <div>
          <label className="block text-sm font-medium text-[#FCFCFC] mb-2">
            Resource Type <span className="text-[#009BFF]">*</span>
          </label>
          <div className="grid grid-cols-5 gap-2">
            {RESOURCE_TYPES.map((rt) => (
              <button
                key={rt.value}
                type="button"
                onClick={() => setType(rt.value)}
                className={`flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl text-xs font-medium transition-all ${
                  type === rt.value
                    ? "bg-[#009BFF] text-white ring-2 ring-[#009BFF]/30"
                    : "bg-white/[0.04] text-white/60 hover:text-white border border-white/[0.08] hover:border-white/20"
                }`}
              >
                <span className="text-lg">{rt.icon}</span>
                {rt.label}
              </button>
            ))}
          </div>
        </div>

        {/* URL */}
        <div>
          <label className="block text-sm font-medium text-[#FCFCFC] mb-2">
            Resource URL
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://drive.google.com/file/d/... or any link"
            className="w-full px-4 py-3 bg-[#00084D]/40 border border-white/[0.08] rounded-xl text-[#FCFCFC] placeholder:text-white/30 focus:outline-none focus:border-[#009BFF] focus:ring-1 focus:ring-[#009BFF]/30 transition-all"
          />
          <p className="text-xs text-white/30 mt-1.5">Google Drive links will auto-embed as video players</p>
        </div>

        {/* Thumbnail URL */}
        <div>
          <label className="block text-sm font-medium text-[#FCFCFC] mb-2">
            Thumbnail URL
          </label>
          <input
            type="url"
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            placeholder="https://... (optional cover image)"
            className="w-full px-4 py-3 bg-[#00084D]/40 border border-white/[0.08] rounded-xl text-[#FCFCFC] placeholder:text-white/30 focus:outline-none focus:border-[#009BFF] focus:ring-1 focus:ring-[#009BFF]/30 transition-all"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-[#FCFCFC] mb-2">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-4 py-3 bg-[#00084D]/40 border border-white/[0.08] rounded-xl text-[#FCFCFC] focus:outline-none focus:border-[#009BFF] focus:ring-1 focus:ring-[#009BFF]/30 transition-all appearance-none"
          >
            <option value="" className="bg-[#090A0F]">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id} className="bg-[#090A0F]">
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-[#FCFCFC] mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="What will people learn from this resource?"
            className="w-full px-4 py-3 bg-[#00084D]/40 border border-white/[0.08] rounded-xl text-[#FCFCFC] placeholder:text-white/30 focus:outline-none focus:border-[#009BFF] focus:ring-1 focus:ring-[#009BFF]/30 transition-all resize-none"
          />
        </div>

        {/* XP Preview */}
        <div className="bg-gradient-to-r from-[#009BFF]/10 to-[#770BFF]/10 border border-[#009BFF]/20 rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-sm font-medium text-[#FCFCFC]">XP Reward</span>
            <p className="text-xs text-white/40 mt-0.5">Earned when your resource is submitted</p>
          </div>
          <span className="text-2xl font-bold text-[#009BFF]">+25 XP</span>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!title || createResource.isPending}
          className="w-full py-3.5 bg-[#009BFF] hover:bg-[#009BFF]/90 text-white font-semibold rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#009BFF]/20"
        >
          {createResource.isPending ? "Submitting..." : "Submit Resource"}
        </button>
      </form>
    </div>
  );
};
