"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Star } from "lucide-react";
import type { College } from "@/types";
import { cn, formatCurrency, formatRating } from "@/lib/utils";

interface CollegeCardProps {
  college: College;
  className?: string;
}

export function CollegeCard({ college, className }: CollegeCardProps) {
  return (
    <motion.article
      whileHover={{ y: -3 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className={cn("group", className)}
    >
      <Link
        href={`/colleges/${college.slug}`}
        className="block rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/25 hover:bg-card/80"
      >
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {college.name}
          </h3>
          <div className="mt-1.5 flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="h-3 w-3 shrink-0" strokeWidth={1.5} />
            <span className="text-xs truncate">
              {college.location}, {college.state}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-foreground tabular-nums">
            {formatCurrency(college.fees)}
            <span className="text-muted-foreground font-normal text-xs"> /yr</span>
          </span>
          <div className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 border border-primary/20">
            <Star className="h-3 w-3 text-primary fill-primary" />
            <span className="text-xs font-medium text-primary tabular-nums">
              {formatRating(college.rating)}
            </span>
          </div>
        </div>

        <span className="inline-flex w-full items-center justify-center rounded-lg border border-border bg-background py-2 text-xs font-medium text-muted-foreground transition-colors group-hover:border-primary/30 group-hover:text-primary">
          View Details
        </span>
      </Link>
    </motion.article>
  );
}
