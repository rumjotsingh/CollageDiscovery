"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { GitCompareArrows, Plus, Save, Trash2, X } from "lucide-react";
import { PublicShell } from "@/components/layout/PublicShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { ComparisonTable } from "@/components/college/ComparisonTable";
import { CollegeCard } from "@/components/college/CollegeCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { SearchBar } from "@/components/ui/SearchBar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CollegeGridSkeleton } from "@/components/ui/college-skeletons";
import {
  useCompare,
  useDeleteSavedComparison,
  useSaveComparison,
  useSavedComparisons,
} from "@/hooks/useCompare";
import { useColleges } from "@/hooks/useColleges";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useRequireAuth } from "@/components/auth/LoginModal";
import { useAuth } from "@/providers/AuthProvider";
import type { College } from "@/types";
import type { SavedComparison } from "@/lib/api/compare";

export function ComparePage() {
  const [selected, setSelected] = useState<College[]>([]);
  const [search, setSearch] = useState("");
  const [saveName, setSaveName] = useState("");
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const debouncedSearch = useDebouncedValue(search, 300);

  const { isAuthenticated } = useAuth();
  const { requireAuth } = useRequireAuth();
  const { data, isLoading, isFetching } = useColleges({
    search: debouncedSearch || undefined,
    sortBy: "rating",
    sortOrder: "desc",
    limit: 12,
  });
  const compareMutation = useCompare();
  const {
    data: savedComparisons = [],
    isLoading: loadingSaved,
    isError: savedError,
    refetch: refetchSaved,
  } = useSavedComparisons();
  const saveComparisonMutation = useSaveComparison();
  const deleteSavedMutation = useDeleteSavedComparison();

  const colleges = data?.pages[0]?.data ?? [];
  const isSearching = debouncedSearch.length > 0;

  const availableToAdd = useMemo(
    () => colleges.filter((c) => !selected.find((s) => s.id === c.id)),
    [colleges, selected],
  );

  const showCollegeSkeleton = isLoading || (isFetching && isSearching);

  const addCollege = (college: College) => {
    if (selected.find((c) => c.id === college.id)) return;
    if (selected.length >= 4) return;
    setSelected((prev) => [...prev, college]);
  };

  const removeCollege = (id: string) => {
    setSelected((prev) => prev.filter((c) => c.id !== id));
    compareMutation.reset();
  };

  const loadSavedComparison = (saved: SavedComparison) => {
    const loaded = saved.colleges.map(
      (college) =>
        ({
          id: college.id,
          name: college.name,
          slug: college.slug,
          location: college.location,
          state: college.state,
          fees: college.fees,
          rating: college.rating,
          overview: "",
          createdAt: saved.createdAt,
        }) satisfies College,
    );

    setSelected(loaded);
    setSaveName(saved.name);
    setSaveMessage(null);
  };

  const handleSaveComparison = () => {
    if (selected.length < 2) return;

    const name = saveName.trim() || `Comparison ${new Date().toLocaleDateString()}`;

    requireAuth(() => {
      saveComparisonMutation.mutate(
        {
          name,
          collegeIds: selected.map((c) => c.id),
        },
        {
          onSuccess: () => {
            setSaveMessage("Comparison saved.");
            setSaveName(name);
          },
          onError: (error) => {
            setSaveMessage(
              error instanceof Error ? error.message : "Failed to save comparison.",
            );
          },
        },
      );
    });
  };

  const handleDeleteSaved = (id: string) => {
    requireAuth(() => {
      deleteSavedMutation.mutate(id);
    });
  };

  useEffect(() => {
    if (selected.length >= 2) {
      compareMutation.mutate({ collegeIds: selected.map((c) => c.id) });
    } else {
      compareMutation.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const pickerTitle = isSearching
    ? `Search results for "${debouncedSearch}"`
    : selected.length > 0
      ? "Add more colleges"
      : "Popular colleges — tap to compare";

  return (
    <PublicShell>
      <div className="p-6 lg:p-8 max-w-6xl mx-auto">
        <PageHeader
          title="Compare Colleges"
          description="Pick up to 4 colleges — comparison updates automatically"
        />

        {isAuthenticated && (
          <div className="mb-6 rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between gap-3 mb-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Saved Comparisons
              </p>
              {loadingSaved && (
                <span className="text-xs text-muted-foreground">Loading…</span>
              )}
            </div>

            {savedError && (
              <ErrorState
                message="Failed to load saved comparisons."
                onRetry={() => refetchSaved()}
              />
            )}

            {!loadingSaved && !savedError && savedComparisons.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No saved comparisons yet. Compare colleges and save your list below.
              </p>
            )}

            {!loadingSaved && savedComparisons.length > 0 && (
              <div className="space-y-2">
                {savedComparisons.map((saved) => (
                  <div
                    key={saved.id}
                    className="flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-2"
                  >
                    <button
                      type="button"
                      onClick={() => loadSavedComparison(saved)}
                      className="flex-1 min-w-0 text-left"
                    >
                      <p className="text-sm font-medium text-foreground truncate">
                        {saved.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {saved.colleges.map((c) => c.name).join(" · ")}
                      </p>
                    </button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0 text-muted-foreground hover:text-red-400"
                      onClick={() => handleDeleteSaved(saved.id)}
                      disabled={deleteSavedMutation.isPending}
                      aria-label="Delete saved comparison"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {selected.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {selected.map((college) => (
              <div
                key={college.id}
                className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs text-primary"
              >
                <span className="max-w-[160px] truncate">{college.name}</span>
                <button onClick={() => removeCollege(college.id)} aria-label="Remove">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {selected.length >= 2 && (
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center">
            <Input
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              placeholder="Name this comparison (optional)"
              className="bg-card border-border text-sm"
            />
            <Button
              onClick={handleSaveComparison}
              disabled={saveComparisonMutation.isPending}
              className="shrink-0 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Save className="h-3.5 w-3.5 mr-1.5" />
              {saveComparisonMutation.isPending ? "Saving…" : "Save Comparison"}
            </Button>
          </div>
        )}

        {saveMessage && (
          <p className="mb-4 text-xs text-muted-foreground">{saveMessage}</p>
        )}

        {compareMutation.isPending && selected.length >= 2 && (
          <CollegeGridSkeleton count={2} />
        )}

        {compareMutation.isError && (
          <ErrorState
            message="Comparison failed."
            onRetry={() =>
              compareMutation.mutate({ collegeIds: selected.map((c) => c.id) })
            }
          />
        )}

        {compareMutation.data && !compareMutation.isPending && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="mb-10"
          >
            <ComparisonTable colleges={compareMutation.data} />
          </motion.div>
        )}

        {selected.length < 2 && (
          <EmptyState
            icon={GitCompareArrows}
            title="Select colleges to compare"
            description="Tap colleges below to add them. Comparison starts when you pick 2 or more."
            className="py-10"
          />
        )}

        <div className="mt-6">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {pickerTitle}
            </p>
            {selected.length > 0 && selected.length < 4 && (
              <span className="text-xs text-muted-foreground">
                {4 - selected.length} slot{4 - selected.length !== 1 ? "s" : ""} left
              </span>
            )}
          </div>

          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search colleges to compare…"
            className="mb-4"
          />

          {showCollegeSkeleton ? (
            <CollegeGridSkeleton count={6} />
          ) : availableToAdd.length === 0 ? (
            <EmptyState
              icon={GitCompareArrows}
              title={isSearching ? "No colleges found" : "No colleges to add"}
              description={
                isSearching
                  ? `Try a different name, city, or state for "${debouncedSearch}".`
                  : selected.length >= 4
                    ? "You can compare up to 4 colleges. Remove one to add another."
                    : "Try searching for a college above."
              }
              className="py-8"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {availableToAdd.map((college) => (
                <div key={college.id} className="relative group">
                  <CollegeCard college={college} />
                  <button
                    onClick={() => addCollege(college)}
                    disabled={selected.length >= 4}
                    className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground opacity-0 group-hover:opacity-100 transition-soft disabled:opacity-30 shadow-md"
                    aria-label="Add to compare"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PublicShell>
  );
}
