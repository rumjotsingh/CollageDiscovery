import type { ApiResponse, AuthResponse, User } from "@/types";
import { apiClient, setToken } from "./client";

export async function login(email: string, password: string) {
  const res = await apiClient<ApiResponse<AuthResponse>>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setToken(res.data!.accessToken);
  return res.data!;
}

export async function register(name: string, email: string, password: string) {
  const res = await apiClient<ApiResponse<AuthResponse>>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
  setToken(res.data!.accessToken);
  return res.data!;
}

export async function fetchProfile() {
  const res = await apiClient<ApiResponse<User>>("/auth/profile");
  return res.data!;
}

export function logout() {
  setToken(null);
}
