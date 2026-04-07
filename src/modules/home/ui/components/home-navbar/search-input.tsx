"use client";

import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const SearchInput = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form className="flex w-full max-w-[480px]" onSubmit={handleSearch}>
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Search resources..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-4 py-2 pr-12 rounded-l-full bg-[#00084D]/40 border border-white/[0.08] text-[#FCFCFC] placeholder:text-white/40 focus:outline-none focus:border-[#009BFF] focus:ring-1 focus:ring-[#009BFF] transition-colors"
        />
      </div>
      <button
        type="submit"
        name="search resources"
        aria-label="Search resources"
        className="px-5 py-2.5 bg-[#00084D]/60 border border-l-0 border-white/[0.08] rounded-r-full hover:bg-[#009BFF]/20 text-white/60 hover:text-[#009BFF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <SearchIcon className="size-5" />
      </button>
    </form>
  );
};
