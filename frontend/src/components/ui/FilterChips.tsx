"use client";

import { cn } from "@/lib/utils";

export interface FilterChip {
  id: string;
  label: string;
  active?: boolean;
}

interface FilterChipsProps {
  chips: FilterChip[];
  onToggle: (id: string) => void;
  className?: string;
}

export function FilterChips({ chips, onToggle, className }: FilterChipsProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {chips.map((chip) => (
        <button
          key={chip.id}
          onClick={() => onToggle(chip.id)}
          className={cn(
            "inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium transition-soft border",
            chip.active
              ? "bg-primary/10 text-primary border-primary/30"
              : "bg-surface text-text-secondary border-border hover:border-border-hover hover:text-text-primary",
          )}
        >
          {chip.label}
        </button>
      ))}
    </div>
  );
}
