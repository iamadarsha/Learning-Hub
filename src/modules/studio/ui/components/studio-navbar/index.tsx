import { SidebarTrigger } from "@/components/ui/sidebar";
import { AuthButton } from "@/modules/auth/ui/components/auth-button";
import Link from "next/link";

export const StudioNavbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-[#090A0F] flex items-center px-2 pr-5 z-50 border-b border-white/[0.06]">
      <div className="flex items-center gap-4 w-full">
        {/* Menu and Logo */}
        <div className="flex items-center shrink-0">
          <SidebarTrigger className="text-white/60 hover:text-white" />

          <Link href={"/studio"}>
            <div className="flex items-center gap-1.5 p-4">
              <span className="text-[#009BFF] font-bold text-lg">//</span>
              <p className="text-xl font-semibold tracking-tight text-[#FCFCFC]">
                hyvmind <span className="text-sm font-normal text-white/40">studio</span>
              </p>
            </div>
          </Link>
        </div>

        {/* Spacer */}
        <div className="flex-1" />
        <div className="flex-shrink-0 items-center flex gap-4">
          <Link
            href="/studio/submit"
            className="px-4 py-2 bg-[#009BFF] hover:bg-[#009BFF]/90 text-white text-sm font-medium rounded-full transition-colors"
          >
            + Submit Resource
          </Link>
          <div className="size-8">
            <AuthButton />
          </div>
        </div>
      </div>
    </nav>
  );
};
