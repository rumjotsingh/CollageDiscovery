"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, LogOut, Bookmark } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UserMenuProps {
  className?: string;
  buttonClassName?: string;
  align?: "start" | "end";
  side?: "top" | "bottom";
  showName?: boolean;
  responsiveName?: boolean;
}

export function UserMenu({
  className,
  buttonClassName,
  align = "end",
  side = "bottom",
  showName = true,
  responsiveName = false,
}: UserMenuProps) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  if (!user) return null;

  return (
    <div ref={ref} className={cn("relative", className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen((prev) => !prev)}
        className={cn("gap-1.5 text-xs h-8", buttonClassName)}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary text-[10px] font-semibold">
          {user.name.charAt(0)}
        </span>
        {showName && (
          <span
            className={cn(
              "max-w-[120px] truncate",
              responsiveName && "hidden sm:inline",
            )}
          >
            {user.name}
          </span>
        )}
        <ChevronDown
          className={cn(
            "h-3 w-3 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </Button>

      {open && (
        <div
          role="menu"
          className={cn(
            "absolute z-50 w-52 rounded-xl border border-border bg-card py-1 shadow-lg",
            align === "end" ? "right-0" : "left-0",
            side === "bottom" ? "top-full mt-1.5" : "bottom-full mb-1.5",
          )}
        >
          <div className="px-3 py-2 border-b border-border">
            <p className="text-xs font-medium text-foreground truncate">{user.name}</p>
            <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
          </div>
          <Link
            href="/saved"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-white/[0.04] transition-colors"
          >
            <Bookmark className="h-3.5 w-3.5" />
            Saved Colleges
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              logout();
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-red-400 hover:bg-red-500/5 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
