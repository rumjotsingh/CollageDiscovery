import type { ApiResponse, College } from "@/types";
import { apiClient } from "./client";

export async function fetchSavedColleges() {
  const res = await apiClient<ApiResponse<College[]>>("/saved");
  return res.data ?? [];
}

export async function saveCollege(collegeId: string) {
  const res = await apiClient<ApiResponse<College>>(`/saved/${collegeId}`, {
    method: "POST",
  });
  return res.data!;
}

export async function unsaveCollege(collegeId: string) {
  return apiClient<ApiResponse<{ message: string }>>(`/saved/${collegeId}`, {
    method: "DELETE",
  });
}
