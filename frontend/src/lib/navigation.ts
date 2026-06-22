import { GraduationCap, GitCompareArrows, Bookmark } from "lucide-react";

export const MAIN_NAV = [
  { label: "Colleges", href: "/colleges", icon: GraduationCap },
  { label: "Compare", href: "/compare", icon: GitCompareArrows },
  { label: "Saved", href: "/saved", icon: Bookmark },
] as const;

export const FOOTER_LINKS = [
  { label: "Home", href: "/" },
  { label: "Colleges", href: "/colleges" },
  { label: "Compare", href: "/compare" },
] as const;
