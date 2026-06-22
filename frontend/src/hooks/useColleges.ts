"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fetchColleges, fetchCollegeBySlug } from "@/lib/api/colleges";
import type { CollegeFilters } from "@/types";

export function useColleges(filters: CollegeFilters & { limit?: number } = {}) {
  const limit = filters.limit ?? 12;

  return useInfiniteQuery({
    queryKey: ["colleges", filters],
    queryFn: ({ pageParam = 1 }) =>
      fetchColleges({ ...filters, page: pageParam, limit }),
    getNextPageParam: (lastPage) =>
      lastPage.pagination?.hasNextPage
        ? (lastPage.pagination.page ?? 1) + 1
        : undefined,
    initialPageParam: 1,
  });
}

export function useCollege(slug: string) {
  return useQuery({
    queryKey: ["college", slug],
    queryFn: () => fetchCollegeBySlug(slug),
    enabled: !!slug,
  });
}
