"use client";

import { Separator } from "@/components/ui/separator";
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
  ClockIcon,
  CompassIcon,
  HeartIcon,
  HomeIcon,
  PlusCircleIcon,
  SettingsIcon,
  UsersIcon,
  WrenchIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  auth?: boolean;
  disabled?: boolean;
  badge?: string;
};

const discoveryItems: NavItem[] = [
  { title: "Home", url: "/", icon: HomeIcon },
  { title: "Explore", url: "/explore", icon: CompassIcon },
  { title: "Find Experts", url: "/experts", icon: UsersIcon },
  { title: "Fix the itch", url: "/fix-the-itch", icon: WrenchIcon, disabled: true, badge: "Soon" },
];

const personalItems: NavItem[] = [
  { title: "Contribute", url: "/studio/contribute", icon: PlusCircleIcon, auth: true },
  { title: "My Progress", url: "/progress", icon: BarChart3Icon, auth: true },
];

const libraryItems: NavItem[] = [
  { title: "Recently Viewed", url: "/history", icon: ClockIcon, auth: true },
  { title: "My Favourites", url: "/favorites", icon: HeartIcon, auth: true },
];

const systemItems: NavItem[] = [
  { title: "Settings", url: "/settings", icon: SettingsIcon, auth: true },
];

function NavGroup({ items }: { items: NavItem[] }) {
  const clerk = useClerk();
  const { isSignedIn } = useAuth();
  const pathname = usePathname();

  return (
    <>
      {items.map((item) => {
        const isActive = pathname === item.url;

        if (item.disabled) {
          return (
            <SidebarMenuItem key={item.title}>
              <div className="flex items-center gap-4 px-3 py-2 rounded-lg text-white/40 cursor-default">
                <item.icon className="size-4" />
                <span className="text-sm">{item.title}</span>
                {item.badge && (
                  <span className="ml-auto text-[10px] bg-white/10 text-white/40 px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </div>
            </SidebarMenuItem>
          );
        }

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
    </>
  );
}

export const MainSection = () => {
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          <NavGroup items={discoveryItems} />
          <Separator className="my-2 bg-white/[0.08]" />
          <NavGroup items={personalItems} />
          <Separator className="my-2 bg-white/[0.08]" />
          <NavGroup items={libraryItems} />
          <Separator className="my-2 bg-white/[0.08]" />
          <NavGroup items={systemItems} />
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
