import type { ApiResponse } from "@/types";
import { apiClient } from "./client";

export interface Question {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: { id: string; name: string };
  college: { id: string; name: string; slug: string };
  _count?: { answers: number };
  answers?: Answer[];
}

export interface Answer {
  id: string;
  content: string;
  createdAt: string;
  user: { id: string; name: string };
}

export interface QuestionDetail {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  user: { id: string; name: string };
  college: { id: string; name: string; slug: string; location: string; state: string };
  answers: Answer[];
}

export async function fetchDiscussions(collegeId?: string) {
  const query = collegeId ? `?collegeId=${collegeId}&limit=20` : "?limit=20";
  const res = await apiClient<ApiResponse<Question[]>>(`/discussions${query}`);
  return res.data ?? [];
}

export async function fetchDiscussion(id: string) {
  const res = await apiClient<ApiResponse<QuestionDetail>>(`/discussions/${id}`);
  return res.data!;
}

export async function askQuestion(collegeId: string, title: string, content: string) {
  const res = await apiClient<ApiResponse<Question>>("/discussions/questions", {
    method: "POST",
    body: JSON.stringify({ collegeId, title, content }),
  });
  return res.data!;
}

export async function postAnswer(questionId: string, content: string) {
  const res = await apiClient<ApiResponse<Answer>>(
    `/discussions/questions/${questionId}/answers`,
    { method: "POST", body: JSON.stringify({ content }) },
  );
  return res.data!;
}
