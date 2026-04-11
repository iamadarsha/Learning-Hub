import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { MainSection } from "./main-section";

export const HomeSidebar = () => {
  return (
    <Sidebar className="pt-16 z-40 border-none" collapsible="icon">
      <SidebarContent className="bg-[#0D1020] border-r border-white/[0.06]">
        <MainSection />
      </SidebarContent>
    </Sidebar>
  );
};
