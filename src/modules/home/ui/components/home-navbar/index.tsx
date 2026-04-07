import { SidebarTrigger } from "@/components/ui/sidebar";
import { AuthButton } from "@/modules/auth/ui/components/auth-button";
import { TrophyIcon } from "lucide-react";
import Link from "next/link";
import { SearchInput } from "./search-input";

export const HomeNavbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-[#090A0F] flex items-center px-2 pr-5 z-50 border-b border-white/[0.06]">
      <div className="flex items-center gap-4 w-full">
        {/* Menu and Logo */}
        <div className="flex items-center shrink-0">
          <SidebarTrigger className="text-white/60 hover:text-white" />

          <Link href={"/"}>
            <div className="flex items-center gap-1.5 p-4">
              <span className="text-[#009BFF] font-bold text-lg">//</span>
              <p className="text-xl font-semibold tracking-tight text-[#FCFCFC]">hyvmind</p>
            </div>
          </Link>
        </div>

        {/* Search bar */}
        <div className="flex-1 flex justify-center max-w-[480px] mx-auto">
          <SearchInput />
        </div>

        <div className="shrink-0 items-center flex gap-4">
          <Link
            href="/leaderboard"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm text-white/60 hover:text-[#009BFF] transition-colors"
          >
            <TrophyIcon className="size-4" />
          </Link>
          <div className="w-26 flex items-center justify-center">
            <AuthButton />
          </div>
        </div>
      </div>
    </nav>
  );
};
