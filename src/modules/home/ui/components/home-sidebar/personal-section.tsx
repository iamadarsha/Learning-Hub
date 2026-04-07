"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth, useClerk } from "@clerk/nextjs";
import { BookmarkIcon, ClockIcon, StarIcon } from "lucide-react";
import Link from "next/link";

const items = [
  {
    title: "Recently Viewed",
    url: "/history",
    icon: ClockIcon,
    auth: true,
  },
  {
    title: "Saved",
    url: "/saved",
    icon: BookmarkIcon,
    auth: true,
  },
  {
    title: "Favorites",
    url: "/favorites",
    icon: StarIcon,
    auth: true,
  },
];

export const PersonalSection = () => {
  const clerk = useClerk();
  const { isSignedIn } = useAuth();

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-white/40 text-xs uppercase tracking-wider">
        You
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                asChild
                isActive={false}
                className="text-white/60 hover:text-[#FCFCFC] hover:bg-white/[0.04]"
                onClick={(e) => {
                  if (!isSignedIn && item.auth) {
                    e.preventDefault();
                    return clerk.openSignIn({ redirectUrl: item.url });
                  }
                }}
              >
                <Link href={item.url} className="flex items-center gap-4">
                  <item.icon className="size-4" />
                  <span className="text-sm">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
