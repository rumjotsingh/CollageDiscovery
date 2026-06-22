"use client";

import { useCallback, useState } from "react";
import { GraduationCap, Mail, Lock, User, ArrowRight, Sparkles, FlaskConical } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/providers/AuthProvider";
import { useAuthModal } from "@/providers/AuthModalProvider";
import { login, register } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { DEMO_USER } from "@/lib/auth/demo";
import { cn } from "@/lib/utils";

async function completeLogin(
  email: string,
  password: string,
  setUser: ReturnType<typeof useAuth>["setUser"],
  refreshProfile: ReturnType<typeof useAuth>["refreshProfile"],
  consumeSuccessCallback: ReturnType<typeof useAuthModal>["consumeSuccessCallback"],
  closeLogin: () => void,
  resetForm: () => void,
) {
  const res = await login(email, password);
  setUser(res.user);
  await refreshProfile();
  const onSuccess = consumeSuccessCallback();
  closeLogin();
  resetForm();
  onSuccess?.();
}

export function LoginModal() {
  const { isOpen, closeLogin, consumeSuccessCallback } = useAuthModal();
  const { setUser, refreshProfile } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setError("");
    setName("");
    setEmail("");
    setPassword("");
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      closeLogin();
      resetForm();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (mode === "register") {
        const res = await register(name, email, password);
        setUser(res.user);
        await refreshProfile();
        const onSuccess = consumeSuccessCallback();
        closeLogin();
        resetForm();
        onSuccess?.();
      } else {
        await completeLogin(
          email,
          password,
          setUser,
          refreshProfile,
          consumeSuccessCallback,
          closeLogin,
          resetForm,
        );
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Authentication failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoLogin = async () => {
    setError("");
    setSubmitting(true);
    try {
      await completeLogin(
        DEMO_USER.email,
        DEMO_USER.password,
        setUser,
        refreshProfile,
        consumeSuccessCallback,
        closeLogin,
        resetForm,
      );
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Demo login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[420px] p-0 gap-0 overflow-hidden bg-card border border-white/[0.08]">
        <div className="px-6 pt-6 pb-4 border-b border-border bg-primary/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 border border-primary/25">
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">
                {mode === "login" ? "Welcome back" : "Create your account"}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Save colleges, write reviews & ask questions
              </p>
            </div>
          </div>

          <div className="flex rounded-lg bg-background/60 p-1 border border-border">
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => { setMode(m); setError(""); }}
                className={cn(
                  "flex-1 py-2 rounded-md text-xs font-medium transition-colors",
                  mode === m
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {m === "login" ? "Login" : "Register"}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {mode === "register" && (
            <div className="space-y-1.5">
              <Label htmlFor="auth-name" className="text-xs text-muted-foreground">Full name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  id="auth-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Rahul Sharma"
                  className="pl-9 bg-background border-border h-10"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="auth-email" className="text-xs text-muted-foreground">Email address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="pl-9 bg-background border-border h-10"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="auth-password" className="text-xs text-muted-foreground">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                id="auth-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                placeholder="Min. 8 characters"
                className="pl-9 bg-background border-border h-10"
              />
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={submitting}
            className="w-full h-10 bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
          >
            {submitting ? (
              "Please wait…"
            ) : (
              <>
                {mode === "login" ? "Login" : "Create Account"}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>

          {mode === "login" && (
            <>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-[11px] uppercase">
                  <span className="bg-card px-2 text-muted-foreground">or</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                disabled={submitting}
                onClick={handleDemoLogin}
                className="w-full h-10 border-border hover:bg-primary/5 hover:border-primary/30 gap-2"
              >
                <FlaskConical className="h-4 w-4 text-primary" />
                Login as demo user
              </Button>
              <p className="text-[10px] text-center text-muted-foreground">
                {DEMO_USER.email} · pre-filled test account
              </p>
            </>
          )}

          <p className="text-[11px] text-center text-muted-foreground flex items-center justify-center gap-1">
            <Sparkles className="h-3 w-3 text-primary" />
            Browsing colleges is always free — login only for saving & reviews
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function useRequireAuth() {
  const { isAuthenticated } = useAuth();
  const { openLogin } = useAuthModal();

  const requireAuth = useCallback(
    (action: () => void) => {
      if (isAuthenticated) action();
      else openLogin(action);
    },
    [isAuthenticated, openLogin],
  );

  return { requireAuth, isAuthenticated };
}
