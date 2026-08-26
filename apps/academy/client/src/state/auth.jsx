import React from "react";
import { api, setAuthToken } from "../lib/api";

const TOKEN_KEY = "efa_token";
const USER_KEY = "efa_user";

function getAxiosErrorMessage(err) {
  const msg =
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message ||
    "Unknown error";
  return typeof msg === "string" ? msg : JSON.stringify(msg);
}

const AuthContext = React.createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = React.useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = React.useState(() => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    setAuthToken(token);
  }, [token]);

  const clearError = React.useCallback(() => setError(null), []);

  const login = React.useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/auth/login", { email, password });
      const t = res.data?.token;
      const u = res.data?.user;
      if (!t || !u) throw new Error("Malformed login response");
      localStorage.setItem(TOKEN_KEY, t);
      localStorage.setItem(USER_KEY, JSON.stringify(u));
      setToken(t);
      setUser(u);
    } catch (e) {
      setError(getAxiosErrorMessage(e));
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = React.useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/auth/signup", { email, password });
      const t = res.data?.token;
      const u = res.data?.user;
      if (!t || !u) throw new Error("Malformed signup response");
      localStorage.setItem(TOKEN_KEY, t);
      localStorage.setItem(USER_KEY, JSON.stringify(u));
      setToken(t);
      setUser(u);
    } catch (e) {
      setError(getAxiosErrorMessage(e));
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = React.useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
    setError(null);
    setAuthToken(null);
  }, []);

  const value = { user, token, loading, error, login, signup, logout, clearError };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
