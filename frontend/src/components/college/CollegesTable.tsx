"use client";

import Link from "next/link";
import { Star, Bookmark, BookmarkCheck, ExternalLink } from "lucide-react";
import type { College } from "@/types";
import { cn, formatCurrency, formatRating } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CollegesTableSkeletonRows } from "@/components/ui/college-skeletons";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/AuthProvider";
import { useAuthModal } from "@/providers/AuthModalProvider";
import {
  useSaveCollege,
  useUnsaveCollege,
  useSavedColleges,
} from "@/hooks/useSaved";

interface CollegesTableProps {
  colleges: College[];
  className?: string;
  loadingRowCount?: number;
}

function SaveButton({ college }: { college: College }) {
  const { isAuthenticated } = useAuth();
  const { openLogin } = useAuthModal();
  const { data: saved = [] } = useSavedColleges();
  const saveMutation = useSaveCollege();
  const unsaveMutation = useUnsaveCollege();

  const isSaved = saved.some((c) => c.id === college.id);
  const isPending = saveMutation.isPending || unsaveMutation.isPending;

  const handleClick = () => {
    const action = () => {
      if (isSaved) unsaveMutation.mutate(college.id);
      else saveMutation.mutate(college);
    };
    if (isAuthenticated) action();
    else openLogin(action);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={isPending}
      onClick={handleClick}
      className={cn(
        "h-8 gap-1 text-xs",
        isSaved ? "text-primary" : "text-muted-foreground",
      )}
    >
      {isPending ? (
        "Saving…"
      ) : isSaved ? (
        <>
          <BookmarkCheck className="h-3.5 w-3.5" /> Saved
        </>
      ) : (
        <>
          <Bookmark className="h-3.5 w-3.5" /> Save
        </>
      )}
    </Button>
  );
}

export function CollegesTable({
  colleges,
  className,
  loadingRowCount = 0,
}: CollegesTableProps) {
  return (
    <div className={cn("rounded-xl border border-border bg-card overflow-hidden", className)}>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent bg-muted/30">
            <TableHead className="min-w-[220px]">College</TableHead>
            <TableHead>State</TableHead>
            <TableHead>City</TableHead>
            <TableHead className="text-right">UG Fees</TableHead>
            <TableHead className="text-right">Rating</TableHead>
            <TableHead className="text-right w-[140px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {colleges.map((college) => (
            <TableRow key={college.id}>
              <TableCell>
                <Link
                  href={`/colleges/${college.slug}`}
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors line-clamp-2 whitespace-normal"
                >
                  {college.name}
                </Link>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground whitespace-normal">
                {college.state}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {college.location}
              </TableCell>
              <TableCell className="text-sm text-right tabular-nums">
                {formatCurrency(college.fees)}
              </TableCell>
              <TableCell className="text-right">
                <span className="inline-flex items-center gap-1 text-sm text-primary tabular-nums">
                  <Star className="h-3 w-3 fill-primary" />
                  {formatRating(college.rating)}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <SaveButton college={college} />
                  <Link href={`/colleges/${college.slug}`}>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {loadingRowCount > 0 && (
            <CollegesTableSkeletonRows count={loadingRowCount} />
          )}
        </TableBody>
      </Table>
    </div>
  );
}
