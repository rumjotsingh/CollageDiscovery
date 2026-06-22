import type {
  ApiResponse,
  College,
  CollegeDetail,
  CollegeFilters,
} from "@/types";
import { apiClient, buildQuery } from "./client";

export async function fetchColleges(
  filters: CollegeFilters & { page?: number; limit?: number } = {},
) {
  const query = buildQuery({
    page: filters.page,
    limit: filters.limit,
    search: filters.search,
    location: filters.location,
    state: filters.state,
    minFees: filters.minFees,
    maxFees: filters.maxFees,
    rating: filters.rating,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
  });

  return apiClient<ApiResponse<College[]>>(`/colleges${query}`);
}

export async function fetchCollegeBySlug(slug: string) {
  const res = await apiClient<ApiResponse<CollegeDetail>>(`/colleges/by-slug/${slug}`);
  return res.data!;
}
