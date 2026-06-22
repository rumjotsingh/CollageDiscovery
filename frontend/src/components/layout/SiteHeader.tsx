"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { GraduationCap, Menu, X } from "lucide-react";
import { MAIN_NAV, FOOTER_LINKS } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/layout/UserMenu";
import { useAuth } from "@/providers/AuthProvider";
import { useAuthModal } from "@/providers/AuthModalProvider";
import { useDemoLogin } from "@/hooks/useDemoLogin";

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const { openLogin } = useAuthModal();
  const { loginAsDemo, loading: demoLoading } = useDemoLogin();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
            <GraduationCap className="h-4 w-4 text-primary" strokeWidth={1.5} />
          </div>
          <span className="font-semibold text-sm text-foreground">CollegeIQ</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {MAIN_NAV.map(({ label, href }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                  active
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]",
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 ml-auto">
          {isAuthenticated ? (
            <UserMenu responsiveName />
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                className="text-xs border-border hidden sm:inline-flex"
                disabled={demoLoading}
                onClick={() => loginAsDemo()}
              >
                Demo
              </Button>
              <Button
                size="sm"
                className="text-xs bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => openLogin()}
              >
                Login
              </Button>
            </>
          )}
          <button
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card px-4 py-3 space-y-1">
          {MAIN_NAV.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} CollegeIQ — Discover & compare colleges
        </p>
        <div className="flex gap-4">
          {FOOTER_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
