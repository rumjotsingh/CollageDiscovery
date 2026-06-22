import type { ApiResponse, Review } from "@/types";
import { apiClient } from "./client";

export async function fetchReviews(collegeId: string) {
  const res = await apiClient<ApiResponse<Review[]>>(`/reviews/${collegeId}`);
  return res.data ?? [];
}

export async function createReview(
  collegeId: string,
  rating: number,
  comment: string,
) {
  const res = await apiClient<ApiResponse<Review>>("/reviews", {
    method: "POST",
    body: JSON.stringify({ collegeId, rating, comment }),
  });
  return res.data!;
}
