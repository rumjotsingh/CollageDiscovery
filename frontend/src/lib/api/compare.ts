import type { ApiResponse, CompareCollege } from "@/types";
import { apiClient } from "./client";

export interface SavedComparison {
  id: string;
  name: string;
  createdAt: string;
  collegeIds: string[];
  colleges: {
    id: string;
    name: string;
    slug: string;
    location: string;
    state: string;
    fees: number;
    rating: number;
    placement: {
      averagePackage: number;
      highestPackage: number;
      placementPercentage: number;
    } | null;
  }[];
}

export interface SavedComparisonDetail extends SavedComparison {
  comparison: CompareCollege[];
}

export async function compareColleges(collegeIds: string[], name?: string) {
  const res = await apiClient<ApiResponse<CompareCollege[]>>("/compare", {
    method: "POST",
    body: JSON.stringify({ collegeIds, name }),
  });
  return res.data ?? [];
}

export async function fetchSavedComparisons() {
  const res = await apiClient<ApiResponse<SavedComparison[]>>("/comparisons");
  return res.data ?? [];
}

export async function fetchSavedComparison(id: string) {
  const res = await apiClient<ApiResponse<SavedComparisonDetail>>(
    `/comparisons/${id}`,
  );
  return res.data!;
}

export async function saveComparison(name: string, collegeIds: string[]) {
  // Uses POST /compare with name — saves when authenticated and works on all backend versions
  await compareColleges(collegeIds, name);
  const saved = await fetchSavedComparisons();
  return saved.find((item) => item.name === name.trim()) ?? saved[0];
}

export async function deleteSavedComparison(id: string) {
  await apiClient<ApiResponse<{ message: string }>>(`/comparisons/${id}`, {
    method: "DELETE",
  });
}
