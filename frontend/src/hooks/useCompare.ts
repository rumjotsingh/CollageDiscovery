"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  compareColleges,
  deleteSavedComparison,
  fetchSavedComparison,
  fetchSavedComparisons,
  saveComparison,
} from "@/lib/api/compare";
import { useAuth } from "@/providers/AuthProvider";

export function useCompare() {
  return useMutation({
    mutationFn: ({
      collegeIds,
      name,
    }: {
      collegeIds: string[];
      name?: string;
    }) => compareColleges(collegeIds, name),
  });
}

export function useSavedComparisons() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["saved-comparisons"],
    queryFn: fetchSavedComparisons,
    enabled: isAuthenticated,
  });
}

export function useSavedComparison(id: string) {
  return useQuery({
    queryKey: ["saved-comparisons", id],
    queryFn: () => fetchSavedComparison(id),
    enabled: !!id,
  });
}

export function useSaveComparison() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      name,
      collegeIds,
    }: {
      name: string;
      collegeIds: string[];
    }) => saveComparison(name, collegeIds),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["saved-comparisons"] });
    },
  });
}

export function useDeleteSavedComparison() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSavedComparison(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["saved-comparisons"] });
    },
  });
}
