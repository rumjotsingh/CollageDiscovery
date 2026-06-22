"use client";

import Link from "next/link";
import { Trophy } from "lucide-react";
import { cn, formatCurrency, formatRating } from "@/lib/utils";
import type { CompareCollege } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ComparisonTableProps {
  colleges: CompareCollege[];
  className?: string;
}

type MetricKey =
  | "fees"
  | "rating"
  | "establishedYear"
  | "averagePackage"
  | "highestPackage"
  | "placementPercentage"
  | "location";

interface Row {
  label: string;
  key: MetricKey;
  format: (college: CompareCollege) => string;
  higherIsBetter?: boolean;
}

const ROWS: Row[] = [
  {
    label: "Location",
    key: "location",
    format: (c) => `${c.location}, ${c.state}`,
  },
  {
    label: "Annual Fees",
    key: "fees",
    format: (c) => formatCurrency(c.fees),
    higherIsBetter: false,
  },
  {
    label: "Rating",
    key: "rating",
    format: (c) => formatRating(c.rating),
    higherIsBetter: true,
  },
  {
    label: "Established",
    key: "establishedYear",
    format: (c) => String(c.establishedYear),
    higherIsBetter: false,
  },
  {
    label: "Avg. Package",
    key: "averagePackage",
    format: (c) =>
      c.placement ? `₹${c.placement.averagePackage} LPA` : "—",
    higherIsBetter: true,
  },
  {
    label: "Highest Package",
    key: "highestPackage",
    format: (c) =>
      c.placement ? `₹${c.placement.highestPackage} LPA` : "—",
    higherIsBetter: true,
  },
  {
    label: "Placement %",
    key: "placementPercentage",
    format: (c) =>
      c.placement ? `${c.placement.placementPercentage}%` : "—",
    higherIsBetter: true,
  },
];

function getBestIndex(
  colleges: CompareCollege[],
  row: Row,
): number | null {
  if (row.key === "location") return null;

  const values = colleges.map((c) => {
    if (row.key === "fees" || row.key === "rating" || row.key === "establishedYear") {
      return c[row.key] as number;
    }
    if (!c.placement) return null;
    return c.placement[row.key as keyof typeof c.placement] as number;
  });

  const valid = values.filter((v): v is number => v !== null);
  if (valid.length === 0) return null;

  const best = row.higherIsBetter ? Math.max(...valid) : Math.min(...valid);
  return values.findIndex((v) => v === best);
}

export function ComparisonTable({ colleges, className }: ComparisonTableProps) {
  if (colleges.length === 0) return null;

  return (
    <div className={cn("rounded-xl border border-border bg-card", className)}>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-40 text-xs uppercase tracking-wide text-muted-foreground">
              Metric
            </TableHead>
            {colleges.map((college) => (
              <TableHead key={college.id} className="min-w-[180px]">
                <Link
                  href={`/colleges/${college.slug}`}
                  className="text-sm font-semibold text-foreground hover:text-primary transition-colors line-clamp-2 whitespace-normal"
                >
                  {college.name}
                </Link>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {ROWS.map((row) => {
            const bestIdx = getBestIndex(colleges, row);
            return (
              <TableRow key={row.key}>
                <TableCell className="text-xs font-medium text-muted-foreground">
                  {row.label}
                </TableCell>
                {colleges.map((college, idx) => (
                  <TableCell
                    key={college.id}
                    className={cn(
                      "text-sm tabular-nums",
                      bestIdx === idx
                        ? "text-primary font-medium bg-primary/10"
                        : "text-muted-foreground",
                    )}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      {bestIdx === idx && (
                        <Trophy className="h-3 w-3 text-primary shrink-0" />
                      )}
                      {row.format(college)}
                    </span>
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
