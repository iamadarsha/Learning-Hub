"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth, useClerk } from "@clerk/nextjs";
import {
  BarChart3Icon,
  CompassIcon,
  HomeIcon,
  PlusCircleIcon,
  SettingsIcon,
  TrophyIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  {
    title: "Home",
    url: "/",
    icon: HomeIcon,
  },
  {
    title: "Explore",
    url: "/explore",
    icon: CompassIcon,
  },
  {
    title: "Experts",
    url: "/experts",
    icon: UsersIcon,
  },
  {
    title: "Leaderboard",
    url: "/leaderboard",
    icon: TrophyIcon,
  },
  {
    title: "Contribute",
    url: "/studio",
    icon: PlusCircleIcon,
    auth: true,
  },
  {
    title: "My Progress",
    url: "/progress",
    icon: BarChart3Icon,
    auth: true,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: SettingsIcon,
    auth: true,
  },
];

export const MainSection = () => {
  const clerk = useClerk();
  const { isSignedIn } = useAuth();
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const isActive = pathname === item.url;
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  asChild
                  isActive={isActive}
                  onClick={(e) => {
                    if (!isSignedIn && item.auth) {
                      e.preventDefault();
                      return clerk.openSignIn({ redirectUrl: item.url });
                    }
                  }}
                  className={
                    isActive
                      ? "bg-[#009BFF]/10 border-l-[3px] border-l-[#009BFF] text-[#009BFF]"
                      : "text-white/60 hover:text-[#FCFCFC] hover:bg-white/[0.04]"
                  }
                >
                  <Link href={item.url} className="flex items-center gap-4" prefetch>
                    <item.icon className="size-4" />
                    <span className="text-sm">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
