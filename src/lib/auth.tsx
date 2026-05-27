"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

import { api, clearTokens, getAccessToken, setTokens } from "./api";
import type { TokenPair, UserOut } from "./types";

interface AuthContextValue {
  user: UserOut | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<UserOut>;
  register: (name: string, email: string, password: string) => Promise<UserOut>;
  logout: () => Promise<void>;
  refresh: () => Promise<UserOut | null>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserOut | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadMe = useCallback(async () => {
    try {
      const me = await api.get<UserOut>("/auth/me");
      setUser(me);
      return me;
    } catch {
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    if (!getAccessToken()) {
      setLoading(false);
      return;
    }
    loadMe().finally(() => setLoading(false));
  }, [loadMe]);

  const login = useCallback(
    async (email: string, password: string) => {
      const tokens = await api.post<TokenPair>(
        "/auth/login",
        { email, password },
        { skipAuth: true }
      );
      setTokens(tokens);
      const me = await api.get<UserOut>("/auth/me");
      setUser(me);
      return me;
    },
    []
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      await api.post<UserOut>(
        "/auth/register",
        { name, email, password },
        { skipAuth: true }
      );
      // após cadastro bem-sucedido, autenticar automaticamente
      return login(email, password);
    },
    [login]
  );

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore — vamos limpar localmente de qualquer jeito
    }
    clearTokens();
    setUser(null);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, refresh: loadMe }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  }
  return ctx;
}

/**
 * Hook para páginas que exigem autenticação.
 * Redireciona para /login se não houver sessão quando o loading terminar.
 */
export function useRequireAuth(): {
  user: UserOut | null;
  loading: boolean;
} {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  return { user, loading };
}
