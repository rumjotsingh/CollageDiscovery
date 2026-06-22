"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { SlidersHorizontal, Compass } from "lucide-react";
import { PublicShell } from "@/components/layout/PublicShell";
import { SearchBar } from "@/components/ui/SearchBar";
import { FilterChips } from "@/components/ui/FilterChips";
import { CollegesTable } from "@/components/college/CollegesTable";
import { CollegesTableSkeleton } from "@/components/ui/college-skeletons";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { useColleges } from "@/hooks/useColleges";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import type { CollegeFilters } from "@/types";

const QUICK_FILTERS = [
  { id: "rating-4", label: "4+ Rating", rating: 4 },
  { id: "fees-low", label: "Under ₹1L", maxFees: 100000 },
  { id: "fees-mid", label: "₹1L – ₹3L", minFees: 100000, maxFees: 300000 },
  { id: "fees-high", label: "Above ₹3L", minFees: 300000 },
  { id: "rating-top", label: "Top Rated", sortBy: "rating", sortOrder: "desc" as const },
];

export function CollegesListingPage() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") ?? "";

  const [search, setSearch] = useState(initialSearch);
  const [location, setLocation] = useState("");
  const [state, setState] = useState("");
  const [minFees, setMinFees] = useState("");
  const [maxFees, setMaxFees] = useState("");
  const [minRating, setMinRating] = useState("");
  const [activeQuickFilters, setActiveQuickFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (initialSearch) setSearch(initialSearch);
  }, [initialSearch]);

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

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const scrollRef = useInfiniteScroll(loadMore, !!hasNextPage);

  const clearFilters = () => {
    setSearch("");
    setLocation("");
    setState("");
    setMinFees("");
    setMaxFees("");
    setMinRating("");
    setActiveQuickFilters([]);
  };

  const inputClass =
    "w-full h-9 rounded-lg border border-border bg-card px-3 text-sm focus:outline-none focus:border-primary/40";

  return (
    <PublicShell>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-foreground mb-1">Colleges in India</h1>
          <p className="text-sm text-muted-foreground">
            {total > 0 ? `${total.toLocaleString()} colleges` : "Browse all colleges — no login needed"}
          </p>
        </div>

        <div className="flex gap-6">
          {/* Left filter sidebar — Collegedunia style */}
          <aside className={`${showFilters ? "block" : "hidden"} lg:block w-full lg:w-56 shrink-0 space-y-4`}>
            <div className="rounded-xl border border-border bg-card p-4 space-y-3 sticky top-20">
              <p className="text-xs font-semibold text-muted-foreground uppercase">Filters</p>
              <input placeholder="State" value={state} onChange={(e) => setState(e.target.value)} className={inputClass} />
              <input placeholder="City" value={location} onChange={(e) => setLocation(e.target.value)} className={inputClass} />
              <input placeholder="Min fees ₹" type="number" value={minFees} onChange={(e) => setMinFees(e.target.value)} className={inputClass} />
              <input placeholder="Max fees ₹" type="number" value={maxFees} onChange={(e) => setMaxFees(e.target.value)} className={inputClass} />
              <input placeholder="Min rating" type="number" min="0" max="5" step="0.5" value={minRating} onChange={(e) => setMinRating(e.target.value)} className={inputClass} />
              <button onClick={clearFilters} className="w-full h-8 text-xs text-muted-foreground border border-border rounded-lg hover:text-foreground">
                Clear all
              </button>
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <div className="flex gap-2 mb-4">
              <div className="flex-1">
                <SearchBar value={search} onChange={setSearch} size="large" />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden h-12 px-3 rounded-xl border border-border bg-card"
              >
                <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            <FilterChips
              chips={QUICK_FILTERS.map((f) => ({
                id: f.id,
                label: f.label,
                active: activeQuickFilters.includes(f.id),
              }))}
              onToggle={(id) =>
                setActiveQuickFilters((prev) =>
                  prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
                )
              }
              className="mb-6"
            />

            {isLoading && <CollegesTableSkeleton count={10} />}
            {isError && <ErrorState message="Failed to load colleges." onRetry={() => refetch()} />}
            {!isLoading && colleges.length === 0 && (
              <EmptyState icon={Compass} title="No colleges found" description="Try adjusting filters." action={
                <button onClick={clearFilters} className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground">Clear filters</button>
              } />
            )}
            {!isLoading && colleges.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <CollegesTable
                  colleges={colleges}
                  loadingRowCount={isFetchingNextPage ? 5 : 0}
                />
              </motion.div>
            )}
            <div ref={scrollRef} className="h-4" aria-hidden />
          </div>
        </div>
      </div>
    </PublicShell>
  );
}
