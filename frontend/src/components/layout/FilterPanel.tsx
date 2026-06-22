"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchBar } from "@/components/ui/SearchBar";

export interface FilterPanelProps {
  search: string;
  onSearchChange: (v: string) => void;
  location: string;
  onLocationChange: (v: string) => void;
  state: string;
  onStateChange: (v: string) => void;
  minFees: string;
  onMinFeesChange: (v: string) => void;
  maxFees: string;
  onMaxFeesChange: (v: string) => void;
  minRating: string;
  onMinRatingChange: (v: string) => void;
  onClear: () => void;
  className?: string;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

function FilterField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-text-muted uppercase tracking-wide">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full h-9 rounded-lg border border-border bg-background px-3 text-sm text-text-primary placeholder:text-text-muted transition-soft focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/20";

export function FilterPanel({
  search,
  onSearchChange,
  location,
  onLocationChange,
  state,
  onStateChange,
  minFees,
  onMinFeesChange,
  maxFees,
  onMaxFeesChange,
  minRating,
  onMinRatingChange,
  onClear,
  className,
  mobileOpen,
  onMobileClose,
}: FilterPanelProps) {
  const content = (
    <div className="space-y-5">
      <div className="flex items-center justify-between lg:hidden">
        <h2 className="text-sm font-semibold text-text-primary">Filters</h2>
        <button
          onClick={onMobileClose}
          className="p-1.5 rounded-lg text-text-muted hover:text-text-secondary transition-soft"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <FilterField label="Search">
        <SearchBar value={search} onChange={onSearchChange} size="default" />
      </FilterField>

      <FilterField label="Location">
        <input
          type="text"
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
          placeholder="e.g. Delhi"
          className={inputClass}
        />
      </FilterField>

      <FilterField label="State">
        <input
          type="text"
          value={state}
          onChange={(e) => onStateChange(e.target.value)}
          placeholder="e.g. Maharashtra"
          className={inputClass}
        />
      </FilterField>

      <FilterField label="Min Fees (₹)">
        <input
          type="number"
          value={minFees}
          onChange={(e) => onMinFeesChange(e.target.value)}
          placeholder="50000"
          className={inputClass}
        />
      </FilterField>

      <FilterField label="Max Fees (₹)">
        <input
          type="number"
          value={maxFees}
          onChange={(e) => onMaxFeesChange(e.target.value)}
          placeholder="500000"
          className={inputClass}
        />
      </FilterField>

      <FilterField label="Min Rating">
        <input
          type="number"
          min="0"
          max="5"
          step="0.5"
          value={minRating}
          onChange={(e) => onMinRatingChange(e.target.value)}
          placeholder="4"
          className={inputClass}
        />
      </FilterField>

      <button
        onClick={onClear}
        className="w-full h-9 rounded-lg border border-border text-xs font-medium text-text-secondary transition-soft hover:border-border-hover hover:text-text-primary"
      >
        Clear all filters
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop panel */}
      <aside
        className={cn(
          "hidden xl:block w-72 shrink-0 border-l border-border bg-surface p-5 overflow-y-auto",
          className,
        )}
      >
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-5">
          Filters
        </h2>
        {content}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="xl:hidden fixed inset-0 bg-black/60 z-50"
            onClick={onMobileClose}
          />
          <aside className="xl:hidden fixed right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-surface border-l border-border z-50 p-5 overflow-y-auto">
            {content}
          </aside>
        </>
      )}
    </>
  );
}
