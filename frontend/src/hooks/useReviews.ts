"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReview } from "@/lib/api/reviews";

export function useCreateReview(collegeId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      rating,
      comment,
    }: {
      rating: number;
      comment: string;
    }) => createReview(collegeId, rating, comment),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["college", collegeId] });
    },
  });
}
