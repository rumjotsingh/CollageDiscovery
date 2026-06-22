"use client";

import { useState } from "react";
import { login } from "@/lib/api/auth";
import { DEMO_USER } from "@/lib/auth/demo";
import { ApiError } from "@/lib/api/client";
import { useAuth } from "@/providers/AuthProvider";

export function useDemoLogin() {
  const { setUser, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginAsDemo = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await login(DEMO_USER.email, DEMO_USER.password);
      setUser(res.user);
      await refreshProfile();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Demo login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loginAsDemo, loading, error };
}
