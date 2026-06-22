"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchSavedColleges,
  saveCollege,
  unsaveCollege,
} from "@/lib/api/saved";
import { useAuth } from "@/providers/AuthProvider";
import type { College } from "@/types";

export function useSavedColleges() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["saved"],
    queryFn: fetchSavedColleges,
    enabled: isAuthenticated,
    staleTime: 30_000,
  });
}

export function useSaveCollege() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (college: College) => saveCollege(college.id),
    onMutate: async (college) => {
      await queryClient.cancelQueries({ queryKey: ["saved"] });
      const previous = queryClient.getQueryData<College[]>(["saved"]);
      queryClient.setQueryData<College[]>(["saved"], (old = []) => {
        if (old.some((c) => c.id === college.id)) return old;
        return [college, ...old];
      });
      return { previous };
    },
    onError: (_err, _college, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["saved"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["saved"] });
    },
  });
}

export function useUnsaveCollege() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unsaveCollege,
    onMutate: async (collegeId) => {
      await queryClient.cancelQueries({ queryKey: ["saved"] });
      const previous = queryClient.getQueryData<College[]>(["saved"]);
      queryClient.setQueryData<College[]>(
        ["saved"],
        (old = []) => old.filter((c) => c.id !== collegeId),
      );
      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["saved"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["saved"] });
    },
  });
}

export function useIsCollegeSaved(collegeId: string | undefined) {
  const { data: saved = [] } = useSavedColleges();
  return saved.some((c) => c.id === collegeId);
}
