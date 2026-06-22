"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, GraduationCap, GitCompareArrows } from "lucide-react";
import { PublicShell } from "@/components/layout/PublicShell";
import { SearchBar } from "@/components/ui/SearchBar";
import { CollegeCard } from "@/components/college/CollegeCard";
import { CollegeGridSkeleton } from "@/components/ui/college-skeletons";
import { Button } from "@/components/ui/button";
import { useColleges } from "@/hooks/useColleges";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function HomePage() {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const { data, isLoading } = useColleges({ sortBy: "rating", sortOrder: "desc", limit: 6 });

  const featured = data?.pages[0]?.data ?? [];

  const handleSearch = () => {
    const q = search.trim();
    router.push(q ? `/colleges?search=${encodeURIComponent(q)}` : "/colleges");
  };

  return (
    <PublicShell>
      <section className="border-b border-border bg-card/40">
        <div className="max-w-7xl mx-auto px-4 py-14 lg:py-20">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
            <h1 className="text-3xl lg:text-4xl font-semibold text-foreground tracking-tight leading-tight mb-3">
              Find the right college in India
            </h1>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Browse, compare, and shortlist colleges — no account needed.
            </p>
            <div className="flex gap-2 mb-6">
              <div className="flex-1">
                <SearchBar value={search} onChange={setSearch} size="large" placeholder="Search colleges by name, city…" />
              </div>
              <Button onClick={handleSearch} className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-6">
                Search
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/colleges">
                <Button variant="outline" size="sm" className="gap-1.5 border-border hover:bg-white/[0.04]">
                  <GraduationCap className="h-3.5 w-3.5" /> Browse Colleges
                </Button>
              </Link>
              <Link href="/compare">
                <Button variant="outline" size="sm" className="gap-1.5 border-border hover:bg-white/[0.04]">
                  <GitCompareArrows className="h-3.5 w-3.5" /> Compare
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-foreground">Top Colleges</h2>
          <Link href="/colleges" className="text-xs text-primary flex items-center gap-1 hover:underline">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        {isLoading ? (
          <CollegeGridSkeleton count={6} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featured.map((c) => (
              <CollegeCard key={c.id} college={c} />
            ))}
          </div>
        )}
      </section>
    </PublicShell>
  );
}
