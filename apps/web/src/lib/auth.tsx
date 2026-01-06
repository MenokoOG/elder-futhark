import React from "react";
import { api, setAuthToken } from "./api";

type AuthUser = {
  id: string;
  email: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
};

const AuthContext = React.createContext<AuthContextValue | null>(null);

function getAxiosErrorMessage(err: any) {
  const data = err?.response?.data;

  // Common Nest patterns: { message: "..."} or { message: ["...","..."] } or { error: "..." }
  const msg =
    data?.message ??
    data?.error ??
    err?.message ??
    "Unknown error";

  if (Array.isArray(msg)) return msg.join(", ");
  if (typeof msg === "string") return msg;

  try {
    return JSON.stringify(msg);
  } catch {
    return "Unknown error";
  }
}

const TOKEN_KEY = "efa_token";
const USER_KEY = "efa_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = React.useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY)
  );

  const [user, setUser] = React.useState<AuthUser | null>(() => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  });

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setAuthToken(token);
  }, [token]);

  const clearError = React.useCallback(() => setError(null), []);

  const applyAuth = React.useCallback((t: string, u: AuthUser) => {
    localStorage.setItem(TOKEN_KEY, t);
    localStorage.setItem(USER_KEY, JSON.stringify(u));
    setToken(t);
    setUser(u);
    setAuthToken(t);
  }, []);

  const login = React.useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.post("/auth/login", { email, password });
      const t = res.data?.token as string | undefined;
      const u = res.data?.user as AuthUser | undefined;

      if (!t || !u?.id || !u?.email) {
        setError("Malformed login response from server");
        return false;
      }

      applyAuth(t, u);
      return true;
    } catch (e) {
      setError(getAxiosErrorMessage(e));
      return false;
    } finally {
      setLoading(false);
    }
  }, [applyAuth]);

  const signup = React.useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.post("/auth/signup", { email, password });
      const t = res.data?.token as string | undefined;
      const u = res.data?.user as AuthUser | undefined;

      if (!t || !u?.id || !u?.email) {
        setError("Malformed signup response from server");
        return false;
      }

      applyAuth(t, u);
      return true;
    } catch (e) {
      setError(getAxiosErrorMessage(e));
      return false;
    } finally {
      setLoading(false);
    }
  }, [applyAuth]);

  const logout = React.useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
    setError(null);
    setAuthToken(null);
  }, []);

  const value: AuthContextValue = {
    user,
    token,
    loading,
    error,
    login,
    signup,
    logout,
    clearError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
