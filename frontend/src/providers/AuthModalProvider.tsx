"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

type AuthModalContextValue = {
  openLogin: (onSuccess?: () => void) => void;
  closeLogin: () => void;
  isOpen: boolean;
  consumeSuccessCallback: () => (() => void) | undefined;
};

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const onSuccessRef = useRef<(() => void) | undefined>(undefined);

  const openLogin = useCallback((callback?: () => void) => {
    onSuccessRef.current = callback;
    setIsOpen(true);
  }, []);

  const closeLogin = useCallback(() => {
    setIsOpen(false);
    onSuccessRef.current = undefined;
  }, []);

  const consumeSuccessCallback = useCallback(() => {
    const cb = onSuccessRef.current;
    onSuccessRef.current = undefined;
    return cb;
  }, []);

  return (
    <AuthModalContext.Provider
      value={{ openLogin, closeLogin, isOpen, consumeSuccessCallback }}
    >
      {children}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const ctx = useContext(AuthModalContext);
  if (!ctx) throw new Error("useAuthModal must be used within AuthModalProvider");
  return ctx;
}
