import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export function CollegesTableSkeletonRows({ count = 5 }: { count?: number }) {
  return Array.from({ length: count }).map((_, i) => (
    <TableRow key={`skeleton-row-${i}`} className="hover:bg-transparent">
      <TableCell>
        <Skeleton className="h-4 w-52 max-w-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-20" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-16" />
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="ml-auto h-4 w-16" />
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="ml-auto h-4 w-10" />
      </TableCell>
      <TableCell className="text-right">
        <div className="ml-auto flex justify-end gap-1">
          <Skeleton className="h-8 w-14 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </TableCell>
    </TableRow>
  ));
}

export function CollegesTableSkeleton({
  count = 10,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card overflow-hidden",
        className,
      )}
      aria-busy="true"
      aria-label="Loading colleges"
    >
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
          <CollegesTableSkeletonRows count={count} />
        </TableBody>
      </Table>
    </div>
  );
}

export function CollegeCardSkeleton() {
  return (
    <div className="glass-card rounded-xl p-5 space-y-4">
      <Skeleton className="h-5 w-3/4 bg-white/[0.04]" />
      <Skeleton className="h-4 w-1/2 bg-white/[0.04]" />
      <div className="flex gap-3">
        <Skeleton className="h-6 w-20 rounded-full bg-white/[0.04]" />
        <Skeleton className="h-6 w-16 rounded-full bg-white/[0.04]" />
      </div>
      <Skeleton className="h-9 w-full rounded-lg bg-white/[0.04]" />
    </div>
  );
}

export function CollegeGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <CollegeCardSkeleton key={i} />
      ))}
    </div>
  );
}
