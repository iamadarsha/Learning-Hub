"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  BarChart3Icon,
  LayoutDashboardIcon,
  PlusCircleIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { StudioSidebarHeader } from "./studio-sidebar-header";

const items = [
  {
    title: "Dashboard",
    url: "/studio",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Contribute",
    url: "/studio/contribute",
    icon: PlusCircleIcon,
  },
  {
    title: "XP History",
    url: "/studio/xp",
    icon: BarChart3Icon,
  },
];

export const StudioSidebar = () => {
  const pathname = usePathname();

  return (
    <Sidebar className="pt-16 z-40 border-none" collapsible="icon">
      <SidebarContent className="bg-[#0D1020]">
        <SidebarGroup>
          <SidebarMenu>
            <StudioSidebarHeader />
            {items.map((item) => {
              const isActive = pathname === item.url;
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={isActive}
                    tooltip={item.title}
                    asChild
                    className={
                      isActive
                        ? "bg-[#009BFF]/10 border-l-[3px] border-l-[#009BFF] text-[#009BFF]"
                        : "text-white/60 hover:text-[#FCFCFC] hover:bg-white/[0.04]"
                    }
                  >
                    <Link href={item.url} prefetch>
                      <item.icon className="size-5" />
                      <span className="text-sm">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
