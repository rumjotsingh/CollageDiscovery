"use client";

import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  size?: "default" | "large";
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search colleges by name, city, or state…",
  className,
  size = "default",
}: SearchBarProps) {
  return (
    <div className={cn("relative w-full", className)}>
      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none"
        strokeWidth={1.5}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full rounded-xl border border-border bg-surface text-text-primary placeholder:text-text-muted transition-soft",
          "focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/20",
          size === "large" ? "h-12 pl-11 pr-10 text-sm" : "h-10 pl-10 pr-9 text-sm",
        )}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-text-muted hover:text-text-secondary transition-soft"
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
