"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LayoutDashboard, Compass, GitCompareArrows, TrendingUp } from "lucide-react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatBadge } from "@/components/ui/StatBadge";
import { useColleges } from "@/hooks/useColleges";
import { useSavedColleges } from "@/hooks/useSaved";
import { useAuth } from "@/providers/AuthProvider";
import { CollegeCard } from "@/components/college/CollegeCard";
import { CollegeGridSkeleton } from "@/components/ui/college-skeletons";

export function DashboardPage() {
  const { user } = useAuth();
  const { data: topColleges, isLoading } = useColleges({ sortBy: "rating", sortOrder: "desc" });
  const { data: saved = [] } = useSavedColleges();

  const featured = topColleges?.pages[0]?.data?.slice(0, 3) ?? [];
  const totalColleges = topColleges?.pages[0]?.pagination?.total ?? 0;

  return (
    <AppShell>
      <div className="p-6 lg:p-8 max-w-5xl mx-auto">
        <PageHeader
          title={user ? `Welcome back, ${user.name.split(" ")[0]}` : "Dashboard"}
          description="Your college discovery overview"
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          <StatBadge label="Total Colleges" value={totalColleges.toLocaleString()} variant="accent" />
          <StatBadge label="Saved" value={saved.length} />
          <StatBadge label="States Covered" value="15+" />
          <StatBadge label="Avg. Rating" value="4.2" variant="success" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
          {[
            { href: "/explore", icon: Compass, label: "Explore", desc: "Browse all colleges" },
            { href: "/compare", icon: GitCompareArrows, label: "Compare", desc: "Side-by-side analysis" },
            { href: "/saved", icon: TrendingUp, label: "Saved", desc: "Your shortlist" },
          ].map(({ href, icon: Icon, label, desc }) => (
            <Link
              key={href}
              href={href}
              className="glass-card rounded-xl p-4 transition-soft hover:border-border-hover group"
            >
              <Icon className="h-4 w-4 text-accent mb-2" strokeWidth={1.5} />
              <p className="text-sm font-medium text-text-primary group-hover:text-accent transition-soft">
                {label}
              </p>
              <p className="text-xs text-text-muted mt-0.5">{desc}</p>
            </Link>
          ))}
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4 text-text-muted" />
              Top Rated Colleges
            </h2>
            <Link href="/explore" className="text-xs text-text-muted hover:text-accent transition-soft">
              View all →
            </Link>
          </div>

          {isLoading ? (
            <CollegeGridSkeleton count={3} />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {featured.map((college) => (
                <CollegeCard key={college.id} college={college} />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
