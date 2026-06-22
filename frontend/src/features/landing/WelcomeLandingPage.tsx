"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Compass,
  GitCompareArrows,
  Bookmark,
  LayoutDashboard,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSavedColleges } from "@/hooks/useSaved";
import { useColleges } from "@/hooks/useColleges";

const QUICK_ACTIONS = [
  {
    href: "/explore",
    icon: Compass,
    label: "Explore Colleges",
    desc: "Browse and filter 100+ institutions",
  },
  {
    href: "/compare",
    icon: GitCompareArrows,
    label: "Compare",
    desc: "Side-by-side analysis",
  },
  {
    href: "/saved",
    icon: Bookmark,
    label: "Saved List",
    desc: "Your shortlist",
  },
  {
    href: "/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
    desc: "Full overview",
  },
];

export function WelcomeLandingPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const { data: saved = [] } = useSavedColleges();
  const { data: collegesData } = useColleges({ sortBy: "rating", limit: 1 });
  const totalColleges = collegesData?.pages[0]?.pagination?.total ?? 0;

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const firstName = user.name.split(" ")[0];

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="border-b border-border px-6 h-14 flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">CollegeIQ</span>
        <Button variant="ghost" size="sm" onClick={logout} className="text-muted-foreground">
          Sign out
        </Button>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="mb-10"
        >
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-14 w-14 rounded-xl">
              <AvatarFallback className="rounded-xl bg-accent text-primary text-lg font-semibold">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm text-muted-foreground">Welcome back</p>
              <h1 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
                Hey, {firstName} 👋
              </h1>
            </div>
          </div>

          <p className="text-muted-foreground max-w-xl leading-relaxed">
            Your college discovery workspace is ready. Explore institutions,
            compare options, and build your shortlist — all in one place.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.1 }}
          className="grid grid-cols-3 gap-3 mb-10"
        >
          {[
            { label: "Colleges", value: totalColleges.toLocaleString(), icon: TrendingUp },
            { label: "Saved", value: String(saved.length), icon: Bookmark },
            { label: "Status", value: "Active", icon: Compass },
          ].map(({ label, value, icon: Icon }) => (
            <Card key={label} className="border-border bg-card">
              <CardContent className="p-4">
                <Icon className="h-4 w-4 text-primary mb-2" strokeWidth={1.5} />
                <p className="text-xl font-semibold text-foreground tabular-nums">{value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.15 }}
        >
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
            Quick Actions
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
            {QUICK_ACTIONS.map(({ href, icon: Icon, label, desc }) => (
              <Link key={href} href={href}>
                <Card className="border-border bg-card hover:border-primary/30 transition-soft cursor-pointer group h-full">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent border border-primary/20 group-hover:border-primary/40 transition-soft">
                      <Icon className="h-4 w-4 text-primary" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground group-hover:text-primary transition-soft">
                        {label}
                      </p>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Enter platform CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.2 }}
          className="glass-card rounded-2xl p-8 border border-border text-center"
        >
          <h2 className="text-lg font-semibold text-foreground mb-2">
            Enter your workspace
          </h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
            Jump into the full dashboard with sidebar navigation, filters, and all tools.
          </p>
          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8"
            >
              Enter Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
