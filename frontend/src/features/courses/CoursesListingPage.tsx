"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { PublicShell } from "@/components/layout/PublicShell";
import { fetchCourses } from "@/lib/api/courses";
import { formatCurrency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchBar } from "@/components/ui/SearchBar";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

export function CoursesListingPage() {
  const [search, setSearch] = useState("");
  const debounced = useDebouncedValue(search, 300);
  const { data, isLoading } = useQuery({
    queryKey: ["courses", debounced],
    queryFn: () => fetchCourses(debounced || undefined, 1, 30),
  });

  const courses = data?.data ?? [];

  return (
    <PublicShell>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-xl font-semibold mb-1">Courses</h1>
        <p className="text-sm text-muted-foreground mb-4">B.Tech, MBA, MBBS and more across Indian colleges</p>
        <div className="max-w-md mb-6">
          <SearchBar value={search} onChange={setSearch} placeholder="Search courses or colleges…" />
        </div>
        {isLoading ? (
          <div className="space-y-2">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
        ) : (
          <div className="space-y-2">
            {courses.map((course) => (
              <Link key={course.id} href={`/courses/${course.id}`}>
                <article className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 hover:border-primary/30 transition-soft">
                  <div>
                    <p className="text-sm font-medium text-foreground">{course.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {course.college.name} · {course.duration}
                    </p>
                  </div>
                  <span className="text-sm text-primary tabular-nums">{formatCurrency(course.fees)}</span>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PublicShell>
  );
}
