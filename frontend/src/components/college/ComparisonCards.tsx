"use client";

import { cn, formatCurrency, formatRating } from "@/lib/utils";
import type { CompareCollege } from "@/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MapPin, Star, Trophy } from "lucide-react";
import Link from "next/link";

interface ComparisonCardsProps {
  colleges: CompareCollege[];
  className?: string;
}

interface Metric {
  label: string;
  getValue: (c: CompareCollege) => string;
  getNumeric?: (c: CompareCollege) => number | null;
  higherIsBetter?: boolean;
}

const METRICS: Metric[] = [
  {
    label: "Annual Fees",
    getValue: (c) => formatCurrency(c.fees),
    getNumeric: (c) => c.fees,
    higherIsBetter: false,
  },
  {
    label: "Rating",
    getValue: (c) => formatRating(c.rating),
    getNumeric: (c) => c.rating,
    higherIsBetter: true,
  },
  {
    label: "Established",
    getValue: (c) => (c.establishedYear ? String(c.establishedYear) : "—"),
    getNumeric: (c) => c.establishedYear ?? null,
    higherIsBetter: false,
  },
  {
    label: "Avg. Package",
    getValue: (c) =>
      c.placement ? `₹${c.placement.averagePackage} LPA` : "—",
    getNumeric: (c) => c.placement?.averagePackage ?? null,
    higherIsBetter: true,
  },
  {
    label: "Highest Package",
    getValue: (c) =>
      c.placement ? `₹${c.placement.highestPackage} LPA` : "—",
    getNumeric: (c) => c.placement?.highestPackage ?? null,
    higherIsBetter: true,
  },
  {
    label: "Placement %",
    getValue: (c) =>
      c.placement ? `${c.placement.placementPercentage}%` : "—",
    getNumeric: (c) => c.placement?.placementPercentage ?? null,
    higherIsBetter: true,
  },
  {
    label: "Courses",
    getValue: (c) => String(c.courses.length),
    getNumeric: (c) => c.courses.length,
    higherIsBetter: true,
  },
];

function getBestIndex(
  colleges: CompareCollege[],
  metric: Metric,
): number | null {
  if (!metric.getNumeric) return null;
  const values = colleges.map((c) => metric.getNumeric!(c));
  const valid = values.filter((v): v is number => v !== null);
  if (valid.length < 2) return null;
  const best = metric.higherIsBetter
    ? Math.max(...valid)
    : Math.min(...valid);
  return values.findIndex((v) => v === best);
}

export function ComparisonCards({ colleges, className }: ComparisonCardsProps) {
  if (colleges.length === 0) return null;

  return (
    <div
      className={cn(
        "flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory",
        className,
      )}
    >
      {colleges.map((college) => (
        <Card
          key={college.id}
          className="min-w-[260px] max-w-[280px] shrink-0 snap-start border-border bg-card"
        >
          <CardHeader className="pb-3 border-b border-border">
            <Link
              href={`/colleges/${college.slug}`}
              className="text-sm font-semibold text-foreground hover:text-primary transition-soft line-clamp-2 leading-snug"
            >
              {college.name}
            </Link>
            <div className="flex items-center gap-1 mt-1.5 text-muted-foreground">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="text-xs truncate">
                {college.location}, {college.state}
              </span>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <Star className="h-3 w-3 text-primary fill-primary" />
              <span className="text-xs font-medium text-primary">
                {formatRating(college.rating)}
              </span>
            </div>
          </CardHeader>

          <CardContent className="pt-3 space-y-2.5">
            {METRICS.map((metric) => {
              const bestIdx = getBestIndex(colleges, metric);
              const isBest = bestIdx === colleges.indexOf(college);
              return (
                <div
                  key={metric.label}
                  className={cn(
                    "flex items-center justify-between rounded-lg px-2.5 py-2",
                    isBest ? "bg-primary/10 border border-primary/20" : "bg-muted/30",
                  )}
                >
                  <span className="text-[11px] text-muted-foreground">
                    {metric.label}
                  </span>
                  <div className="flex items-center gap-1">
                    {isBest && (
                      <Trophy className="h-3 w-3 text-primary" />
                    )}
                    <span
                      className={cn(
                        "text-xs tabular-nums",
                        isBest ? "font-semibold text-primary" : "text-foreground",
                      )}
                    >
                      {metric.getValue(college)}
                    </span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
