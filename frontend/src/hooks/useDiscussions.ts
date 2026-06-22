"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchDiscussions,
  askQuestion,
  postAnswer,
} from "@/lib/api/discussions";

export function useDiscussions(collegeId?: string) {
  return useQuery({
    queryKey: ["discussions", collegeId],
    queryFn: () => fetchDiscussions(collegeId),
    enabled: !!collegeId,
  });
}

export function useAskQuestion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      collegeId,
      title,
      content,
    }: {
      collegeId: string;
      title: string;
      content: string;
    }) => askQuestion(collegeId, title, content),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["discussions", vars.collegeId] });
    },
  });
}

export function usePostAnswer(collegeId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      questionId,
      content,
    }: {
      questionId: string;
      content: string;
    }) => postAnswer(questionId, content),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["discussions", collegeId] });
    },
  });
}
