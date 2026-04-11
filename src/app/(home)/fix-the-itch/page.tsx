"use client";
import { PlusIcon, UserCircleIcon, WrenchIcon } from "lucide-react";

type Card = {
  title: string;
  status: "Open" | "Claimed" | "Solved";
  tags: string[];
  claimer: string | null;
  date: string;
  thumbnailBg: string;
  thumbnailText: string;
};

const OPEN_CARDS: Card[] = [
  {
    title: "Auto-generate A+ content briefs from brand guidelines",
    status: "Open",
    tags: ["AI & Automation", "All Teams"],
    claimer: null,
    date: "8 Apr 2026",
    thumbnailBg: "#E8D5FF",
    thumbnailText: "#5B21B6",
  },
  {
    title: "Batch resize and rename product images using AI",
    status: "Open",
    tags: ["Figma & Design", "Designers"],
    claimer: null,
    date: "9 Apr 2026",
    thumbnailBg: "#FCE7F3",
    thumbnailText: "#9D174D",
  },
  {
    title: "Summarise weekly Slack updates into a digest automatically",
    status: "Open",
    tags: ["n8n Workflows", "All Teams"],
    claimer: null,
    date: "10 Apr 2026",
    thumbnailBg: "#D1FAE5",
    thumbnailText: "#065F46",
  },
];

const CLAIMED_CARDS: Card[] = [
  {
    title: "Pull competitor pricing data from Amazon into a weekly report",
    status: "Claimed",
    tags: ["Amazon & eComm", "Data"],
    claimer: "Sarah C.",
    date: "7 Apr 2026",
    thumbnailBg: "#FFE4CC",
    thumbnailText: "#92400E",
  },
  {
    title: "Create a prompt template library for listing copy",
    status: "Claimed",
    tags: ["Prompt Engineering", "Art Directors"],
    claimer: "James G.",
    date: "6 Apr 2026",
    thumbnailBg: "#E8D5FF",
    thumbnailText: "#5B21B6",
  },
];

const SOLVED_CARDS: Card[] = [
  {
    title: "Bulk colour change in Figma across specific modules only",
    status: "Solved",
    tags: ["Figma & Design", "Designers"],
    claimer: "Debadrita M.",
    date: "5 Apr 2026",
    thumbnailBg: "#FCE7F3",
    thumbnailText: "#9D174D",
  },
  {
    title: "Auto-transcribe knowledge session recordings into step guides",
    status: "Solved",
    tags: ["AI & Automation", "All Teams"],
    claimer: "Debadrita M.",
    date: "3 Apr 2026",
    thumbnailBg: "#D1FAE5",
    thumbnailText: "#065F46",
  },
  {
    title: "Generate icon sets in bulk from a single prompt",
    status: "Solved",
    tags: ["AI Generation", "Designers"],
    claimer: "Debadrita M.",
    date: "1 Apr 2026",
    thumbnailBg: "#FFE4CC",
    thumbnailText: "#92400E",
  },
];

function ProblemCard({ card }: { card: Card }) {
  return (
    <div className="bg-[#00084D] border border-white/[0.08] rounded-2xl overflow-hidden cursor-default">
      <div
        className="w-full p-5 flex items-center justify-center min-h-[100px]"
        style={{ backgroundColor: card.thumbnailBg }}
      >
        <span
          className="font-black text-center text-sm uppercase leading-tight"
          style={{ color: card.thumbnailText }}
        >
          {card.title}
        </span>
      </div>
      <div className="p-4">
        <p className="text-white text-sm font-medium leading-snug mb-3">
          {card.title}
        </p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              card.status === "Open"
                ? "bg-[#009BFF]/15 text-[#009BFF]"
                : card.status === "Claimed"
                  ? "bg-[#770BFF]/15 text-[#770BFF]"
                  : "bg-[#4CC3AE]/15 text-[#4CC3AE]"
            }`}
          >
            {card.status}
          </span>
          {card.tags.map((tag, i) => (
            <span
              key={i}
              className="text-xs px-2 py-0.5 rounded-full bg-white/[0.08] text-white/50"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between">
          {card.claimer ? (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#009BFF]/20 flex items-center justify-center text-[10px] text-[#009BFF] font-bold">
                {card.claimer[0]}
              </div>
              <span className="text-white/40 text-xs">{card.claimer}</span>
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full border border-dashed border-white/20 flex items-center justify-center">
              <UserCircleIcon size={12} className="text-white/20" />
            </div>
          )}
          <span className="text-white/30 text-xs">{card.date}</span>
        </div>
      </div>
    </div>
  );
}

function Column({
  title,
  count,
  cards,
}: {
  title: string;
  count: number;
  cards: Card[];
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-white/80 font-semibold text-sm">{title}</span>
        <span className="text-white/30 text-sm">{count}</span>
      </div>
      <div className="flex flex-col gap-3">
        {cards.map((card, i) => (
          <ProblemCard key={i} card={card} />
        ))}
      </div>
    </div>
  );
}

export default function FixTheItchPage() {
  return (
    <div className="min-h-screen bg-[#090A0F] px-8 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Fix the itch</h1>
        <p className="text-white/50 text-sm mt-1">
          Got a problem AI could solve? Post it. If someone on the team can
          help, they&apos;ll claim it.
        </p>
      </div>
      <div className="mb-8">
        <button
          disabled
          className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-white/30 text-sm cursor-not-allowed flex items-center gap-2"
        >
          <PlusIcon size={14} />
          Post a problem
          <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full">
            Coming soon
          </span>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Column title="Open" count={3} cards={OPEN_CARDS} />
        <Column title="Claimed" count={2} cards={CLAIMED_CARDS} />
        <Column title="Solved" count={3} cards={SOLVED_CARDS} />
      </div>
    </div>
  );
}
