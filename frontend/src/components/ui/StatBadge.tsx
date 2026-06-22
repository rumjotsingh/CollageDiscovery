import { cn } from "@/lib/utils";

interface StatBadgeProps {
  label: string;
  value: React.ReactNode;
  variant?: "default" | "accent" | "success";
  className?: string;
}

export function StatBadge({
  label,
  value,
  variant = "default",
  className,
}: StatBadgeProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 rounded-xl border border-border bg-card px-4 py-3 min-w-[120px]",
        className,
      )}
    >
      <span className="text-xs text-text-muted uppercase tracking-wide">
        {label}
      </span>
      <span
        className={cn(
          "text-lg font-semibold tabular-nums",
          variant === "accent" && "text-primary",
          variant === "success" && "text-emerald-400",
          variant === "default" && "text-text-primary",
        )}
      >
        {value}
      </span>
    </div>
  );
}
