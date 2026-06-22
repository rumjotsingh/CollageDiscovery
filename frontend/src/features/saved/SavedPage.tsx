"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Bookmark, MapPin, Star } from "lucide-react";
import { PublicShell } from "@/components/layout/PublicShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { CollegeGridSkeleton } from "@/components/ui/college-skeletons";
import { useSavedColleges, useUnsaveCollege } from "@/hooks/useSaved";
import { useAuth } from "@/providers/AuthProvider";
import { useAuthModal } from "@/providers/AuthModalProvider";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatRating } from "@/lib/utils";

export function SavedPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { openLogin } = useAuthModal();
  const { data: saved = [], isLoading, isError, refetch } = useSavedColleges();
  const unsaveMutation = useUnsaveCollege();

  if (!authLoading && !isAuthenticated) {
    return (
      <PublicShell>
        <EmptyState
          icon={Bookmark}
          title="Login to view saved colleges"
          description="Create an account or log in to save and manage your favorite colleges."
          action={
            <Button
              onClick={() => openLogin()}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Login to View Saved
            </Button>
          }
        />
      </PublicShell>
    );
  }

  return (
    <PublicShell>
      <div className="p-6 lg:p-8 max-w-3xl mx-auto">
        <PageHeader
          title="Saved Colleges"
          description={
            saved.length > 0
              ? `${saved.length} college${saved.length !== 1 ? "s" : ""} saved`
              : "Your bookmarked colleges"
          }
        />

        {isLoading && <CollegeGridSkeleton count={3} />}

        {isError && (
          <ErrorState message="Failed to load saved colleges." onRetry={() => refetch()} />
        )}

        {!isLoading && !isError && saved.length === 0 && (
          <EmptyState
            icon={Bookmark}
            title="No saved colleges yet"
            description="Browse colleges and tap the save button to add them here."
            action={
              <Link
                href="/colleges"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Explore Colleges
              </Link>
            }
          />
        )}

        {!isLoading && saved.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-2"
          >
            {saved.map((college) => (
              <div
                key={college.id}
                className="flex items-center gap-4 rounded-xl border border-border bg-card px-4 py-4 transition-soft hover:border-border-hover"
              >
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/colleges/${college.slug}`}
                    className="text-sm font-medium text-foreground hover:text-primary transition-colors line-clamp-1"
                  >
                    {college.name}
                  </Link>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="inline-flex items-center gap-1 text-xs text-text-muted">
                      <MapPin className="h-3 w-3" />
                      {college.location}, {college.state}
                    </span>
                    <span className="text-xs text-text-secondary tabular-nums">
                      {formatCurrency(college.fees)}/yr
                    </span>
                    <span className="inline-flex items-center gap-0.5 text-xs text-primary">
                      <Star className="h-3 w-3 fill-primary text-primary" />
                      {formatRating(college.rating)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => unsaveMutation.mutate(college.id)}
                  disabled={unsaveMutation.isPending}
                  className="shrink-0 text-xs text-text-muted hover:text-red-400 transition-soft px-2 py-1"
                >
                  Remove
                </button>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </PublicShell>
  );
}
