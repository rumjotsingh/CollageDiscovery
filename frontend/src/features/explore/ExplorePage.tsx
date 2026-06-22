"use client";

import { useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal, Compass, GraduationCap } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { FilterPanel } from "@/components/layout/FilterPanel";
import { SearchBar } from "@/components/ui/SearchBar";
import { FilterChips } from "@/components/ui/FilterChips";
import { CollegeCard } from "@/components/college/CollegeCard";
import { CollegeGridSkeleton } from "@/components/ui/college-skeletons";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { useColleges } from "@/hooks/useColleges";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import type { CollegeFilters } from "@/types";

const QUICK_FILTERS = [
  { id: "rating-4", label: "4+ Rating", rating: 4 },
  { id: "fees-low", label: "Under ₹1L", maxFees: 100000 },
  { id: "fees-mid", label: "₹1L – ₹5L", minFees: 100000, maxFees: 500000 },
  { id: "rating-top", label: "Top Rated", sortBy: "rating", sortOrder: "desc" as const },
];

export function ExplorePage() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [state, setState] = useState("");
  const [minFees, setMinFees] = useState("");
  const [maxFees, setMaxFees] = useState("");
  const [minRating, setMinRating] = useState("");
  const [activeQuickFilters, setActiveQuickFilters] = useState<string[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const debouncedSearch = useDebouncedValue(search, 300);

  const filters = useMemo<CollegeFilters>(() => {
    const base: CollegeFilters = {
      search: debouncedSearch || undefined,
      location: location || undefined,
      state: state || undefined,
      minFees: minFees ? Number(minFees) : undefined,
      maxFees: maxFees ? Number(maxFees) : undefined,
      rating: minRating ? Number(minRating) : undefined,
      sortBy: "rating",
      sortOrder: "desc",
    };

    activeQuickFilters.forEach((id) => {
      const qf = QUICK_FILTERS.find((f) => f.id === id);
      if (!qf) return;
      if ("rating" in qf && qf.rating) base.rating = qf.rating;
      if ("minFees" in qf && qf.minFees) base.minFees = qf.minFees;
      if ("maxFees" in qf && qf.maxFees) base.maxFees = qf.maxFees;
      if ("sortBy" in qf && qf.sortBy) base.sortBy = qf.sortBy;
      if ("sortOrder" in qf && qf.sortOrder) base.sortOrder = qf.sortOrder;
    });

    return base;
  }, [debouncedSearch, location, state, minFees, maxFees, minRating, activeQuickFilters]);

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useColleges(filters);

  const colleges = data?.pages.flatMap((p) => p.data ?? []) ?? [];
  const total = data?.pages[0]?.pagination?.total ?? 0;
  const hasActiveFilters =
    !!debouncedSearch || !!location || !!state || !!minFees || !!maxFees || !!minRating || activeQuickFilters.length > 0;

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const scrollRef = useInfiniteScroll(loadMore, !!hasNextPage);

  const quickChips = QUICK_FILTERS.map((f) => ({
    id: f.id,
    label: f.label,
    active: activeQuickFilters.includes(f.id),
  }));

  const clearFilters = () => {
    setSearch("");
    setLocation("");
    setState("");
    setMinFees("");
    setMaxFees("");
    setMinRating("");
    setActiveQuickFilters([]);
  };

  return (
    <AppShell
      filterPanel={
        <FilterPanel
          search={search}
          onSearchChange={setSearch}
          location={location}
          onLocationChange={setLocation}
          state={state}
          onStateChange={setState}
          minFees={minFees}
          onMinFeesChange={setMinFees}
          maxFees={maxFees}
          onMaxFeesChange={setMaxFees}
          minRating={minRating}
          onMinRatingChange={setMinRating}
          onClear={clearFilters}
          mobileOpen={mobileFiltersOpen}
          onMobileClose={() => setMobileFiltersOpen(false)}
        />
      }
    >
      <div className="p-6 lg:p-8 max-w-5xl xl:max-w-none mx-auto">
        {/* Hero — Collegedunia-style search first */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-2xl border border-border bg-card p-6 lg:p-8"
        >
          <div className="flex items-center gap-2 mb-3">
            <GraduationCap className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold text-foreground">Find Your College</span>
          </div>
          <p className="text-sm text-muted-foreground mb-4 max-w-xl">
            Browse {total > 0 ? `${total}+` : ""} colleges across India. No login needed to explore or compare.
          </p>
          <SearchBar value={search} onChange={setSearch} size="large" />
        </motion.div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-foreground">
            {hasActiveFilters ? `${total.toLocaleString()} results` : "Top Colleges"}
          </h2>
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="xl:hidden inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-muted-foreground transition-soft hover:text-foreground"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filters
          </button>
        </div>

        <FilterChips
          chips={quickChips}
          onToggle={(id) =>
            setActiveQuickFilters((prev) =>
              prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
            )
          }
          className="mb-6"
        />

        {isLoading && <CollegeGridSkeleton />}

        {isError && (
          <ErrorState message="Failed to load colleges." onRetry={() => refetch()} />
        )}

        {!isLoading && !isError && colleges.length === 0 && (
          <EmptyState
            icon={Compass}
            title="No colleges found"
            description="Try adjusting your search or filters."
            action={
              <button
                onClick={clearFilters}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Clear filters
              </button>
            }
          />
        )}

        {!isLoading && colleges.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-4"
          >
            {colleges.map((college) => (
              <CollegeCard key={college.id} college={college} />
            ))}
          </motion.div>
        )}

        {isFetchingNextPage && (
          <div className="mt-4">
            <CollegeGridSkeleton count={3} />
          </div>
        )}

        <div ref={scrollRef} className="h-4" />
      </div>
    </AppShell>
  );
}
