import type { ApiResponse, PaginationMeta } from "@/types";
import { apiClient, buildQuery } from "./client";

export interface CourseWithCollege {
  id: string;
  collegeId: string;
  name: string;
  duration: string;
  fees: number;
  college: {
    id: string;
    name: string;
    slug: string;
    location: string;
    state: string;
    rating: number;
  };
}

export async function fetchCourses(search?: string, page = 1, limit = 20) {
  const query = buildQuery({ search, page, limit });
  return apiClient<ApiResponse<CourseWithCollege[]>>(`/courses${query}`);
}

export async function fetchCourseById(id: string) {
  const res = await apiClient<ApiResponse<CourseWithCollege>>(`/courses/${id}`);
  return res.data!;
}
