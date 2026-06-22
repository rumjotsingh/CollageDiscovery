"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Compass,
  GitCompareArrows,
  Bookmark,
  User,
  GraduationCap,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { UserMenu } from "@/components/layout/UserMenu";
import { useAuth } from "@/providers/AuthProvider";
import { useAuthModal } from "@/providers/AuthModalProvider";

const NAV_ITEMS = [
  { label: "Explore", href: "/explore", icon: Compass },
  { label: "Compare", href: "/compare", icon: GitCompareArrows },
  { label: "Saved", href: "/saved", icon: Bookmark, authRequired: true },
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const { openLogin } = useAuthModal();

  return (
    <Sidebar collapsible="icon" className="border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip="CollegeIQ"
              render={<Link href="/explore" />}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-accent border border-sidebar-primary/20">
                <GraduationCap className="h-4 w-4 text-sidebar-primary" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold text-sidebar-foreground">
                  CollegeIQ
                </span>
                <span className="text-[10px] text-muted-foreground">
                  Discovery Platform
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
                const isActive =
                  pathname === href || pathname.startsWith(`${href}/`);
                return (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={label}
                      render={<Link href={href} />}
                    >
                      <Icon strokeWidth={1.5} />
                      <span>{label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2">
        {isAuthenticated ? (
          <UserMenu
            align="start"
            side="top"
            buttonClassName="w-full justify-start"
          />
        ) : (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                tooltip="Sign In"
                onClick={() => openLogin()}
              >
                <User strokeWidth={1.5} />
                <span>Sign In</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
