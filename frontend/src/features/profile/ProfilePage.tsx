"use client";

import { useEffect } from "react";
import { LogOut, Bookmark } from "lucide-react";
import Link from "next/link";
import { PublicShell } from "@/components/layout/PublicShell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/AuthProvider";
import { useAuthModal } from "@/providers/AuthModalProvider";

export function ProfilePage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { openLogin } = useAuthModal();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      openLogin();
    }
  }, [isLoading, isAuthenticated, openLogin]);

  if (isLoading) {
    return (
      <PublicShell>
        <div className="max-w-md mx-auto px-4 py-16 h-40 animate-pulse rounded-xl bg-muted/30" />
      </PublicShell>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <PublicShell>
        <div className="max-w-md mx-auto px-4 py-20 text-center">
          <p className="text-sm text-muted-foreground mb-4">Login to view your profile</p>
          <Button onClick={() => openLogin()} className="bg-primary text-primary-foreground hover:bg-primary/90">
            Login
          </Button>
        </div>
      </PublicShell>
    );
  }

  return (
    <PublicShell>
      <div className="max-w-md mx-auto px-4 py-10">
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="px-6 py-5 border-b border-border bg-primary/5">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/15 text-primary text-xl font-semibold">
                {user.name.charAt(0)}
              </div>
              <div>
                <p className="text-base font-semibold text-foreground">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
          </div>
          <div className="p-4 space-y-1">
            <Link
              href="/saved"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/[0.04] transition-colors"
            >
              <Bookmark className="h-4 w-4" /> Saved Colleges
            </Link>
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-red-400 hover:bg-red-500/5 transition-colors"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>
      </div>
    </PublicShell>
  );
}
