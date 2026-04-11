"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ZapIcon } from "lucide-react";

interface ContributeStep4Props {
  onReset: () => void;
}

export function ContributeStep4({ onReset }: ContributeStep4Props) {
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowToast(true), 300);
    const dismiss = setTimeout(() => setShowToast(false), 4300);
    return () => {
      clearTimeout(timer);
      clearTimeout(dismiss);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      {/* Animated checkmark */}
      <div className="size-20 rounded-full border-2 border-[#4CC3AE] flex items-center justify-center mb-6 animate-in fade-in zoom-in duration-500">
        <svg
          className="size-10 text-[#4CC3AE]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 13l4 4L19 7" className="animate-draw-check" />
        </svg>
      </div>

      <h2 className="text-[28px] font-bold text-white">Resource submitted!</h2>
      <p className="text-white/50 mt-2 max-w-sm">
        It&apos;s now live in the feed for your team to discover.
      </p>

      {/* CTAs */}
      <div className="flex items-center gap-3 mt-8">
        <Link
          href="/"
          className="px-6 py-3 bg-[#009BFF] hover:bg-[#009BFF]/90 text-white font-medium rounded-full transition-colors"
        >
          View in feed &rarr;
        </Link>
        <button
          onClick={onReset}
          className="px-6 py-3 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-white/40 font-medium transition-all"
        >
          Submit another
        </button>
      </div>

      {/* XP Toast */}
      <div
        className={`fixed bottom-6 right-6 transition-all duration-500 ${
          showToast
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-3 px-5 py-4 rounded-xl bg-[#00084D]/95 border border-[#009BFF] shadow-lg shadow-[#009BFF]/10">
          <ZapIcon className="size-5 text-[#009BFF]" />
          <div className="text-left">
            <p className="text-white font-semibold text-sm">+25 XP earned</p>
            <p className="text-white/50 text-xs">
              Keep contributing to level up
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
