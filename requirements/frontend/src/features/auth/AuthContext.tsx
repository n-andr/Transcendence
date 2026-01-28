import React, { createContext, useContext, useMemo, useState } from "react";

type AuthUser = {
  email: string;
};

type AuthState = {
  user: AuthUser;
};

type AuthContextValue = {
  auth: AuthState | null;
  setLoggedIn: (user: AuthUser) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState | null>(() => {
    const raw = localStorage.getItem("auth");
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthState;
    } catch {
      localStorage.removeItem("auth");
      return null;
    }
  });

  const value = useMemo<AuthContextValue>(() => {
    return {
      auth,
      setLoggedIn: (user) => {
        const next: AuthState = { user };
        setAuth(next);
        localStorage.setItem("auth", JSON.stringify(next));
      },
      logout: () => {
        setAuth(null);
        localStorage.removeItem("auth");
      },
    };
  }, [auth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
