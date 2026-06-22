"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Compass, GitCompareArrows, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { AppSidebar } from "./AppSidebar";
import { UserMenu } from "./UserMenu";
import { useAuth } from "@/providers/AuthProvider";
import { useAuthModal } from "@/providers/AuthModalProvider";
import { Button } from "@/components/ui/button";

const MOBILE_NAV = [
  { label: "Explore", href: "/explore", icon: Compass },
  { label: "Compare", href: "/compare", icon: GitCompareArrows },
  { label: "Saved", href: "/saved", icon: Bookmark },
];

interface AppShellProps {
  children: React.ReactNode;
  filterPanel?: React.ReactNode;
  title?: string;
}

export function AppShell({ children, filterPanel, title }: AppShellProps) {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const { openLogin } = useAuthModal();

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset className="bg-background">
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-4">
          <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          {title && (
            <h1 className="text-sm font-medium text-foreground">{title}</h1>
          )}
          <div className="ml-auto">
            {isAuthenticated ? (
              <UserMenu responsiveName />
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => openLogin()}
              >
                Login
              </Button>
            )}
          </div>
        </header>

        <div className="flex flex-1 min-h-0">
          <div className="flex-1 min-w-0 pb-20 lg:pb-0 overflow-auto">
            {children}
          </div>
          {filterPanel}
        </div>

        {/* Mobile bottom nav */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-surface/95 backdrop-blur-md">
          <div className="flex items-center justify-around px-2 py-2">
            {MOBILE_NAV.map(({ label, href, icon: Icon }) => {
              const isActive =
                pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-soft min-w-[56px]",
                    isActive ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                  <span className="text-[10px] font-medium">{label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </SidebarInset>
    </SidebarProvider>
  );
}
