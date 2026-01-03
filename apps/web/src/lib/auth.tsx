import React from "react";
import { setAuthToken, api } from "./api";
import { AuthResponseSchema, LoginSchema, SignupSchema } from "@efa/shared";

type AuthState = {
  token: string | null;
  handle: string | null;
  email: string | null;
};

type AuthContextValue = AuthState & {
  signup: (input: { email: string; password: string; handle: string }) => Promise<void>;
  login: (input: { email: string; password: string }) => Promise<void>;
  logout: () => void;
};

const AuthContext = React.createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "efa_token";

function decodeJwt(token: string): { email?: string; handle?: string } {
  try {
    const [, payload] = token.split(".");
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const data = JSON.parse(json);
    return { email: data.email, handle: data.handle };
  } catch {
    return {};
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = React.useState<string | null>(() => localStorage.getItem(STORAGE_KEY));
  const [handle, setHandle] = React.useState<string | null>(null);
  const [email, setEmail] = React.useState<string | null>(null);

  React.useEffect(() => {
    setAuthToken(token);
    if (token) {
      localStorage.setItem(STORAGE_KEY, token);
      const decoded = decodeJwt(token);
      setHandle(decoded.handle ?? null);
      setEmail(decoded.email ?? null);
    } else {
      localStorage.removeItem(STORAGE_KEY);
      setHandle(null);
      setEmail(null);
    }
  }, [token]);

  async function signup(input: { email: string; password: string; handle: string }) {
    const parsed = SignupSchema.parse(input);
    const res = await api.post("/auth/signup", parsed);
    const data = AuthResponseSchema.parse(res.data);
    setToken(data.token);
  }

  async function login(input: { email: string; password: string }) {
    const parsed = LoginSchema.parse(input);
    const res = await api.post("/auth/login", parsed);
    const data = AuthResponseSchema.parse(res.data);
    setToken(data.token);
  }

  function logout() {
    setToken(null);
  }

  const value: AuthContextValue = { token, handle, email, signup, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}