import React from "react";
import { api, setAuthToken } from "./api";

type AuthState = {
  token: string | null;
  user: { id: string; email: string; handle: string } | null;
};

type AuthContextValue = AuthState & {
  signup: (input: { email: string; password: string; handle: string }) => Promise<void>;
  signin: (input: { email: string; password: string }) => Promise<void>;
  signout: () => void;
};

const AuthContext = React.createContext<AuthContextValue | null>(null);

function readBootState(): AuthState {
  const token = localStorage.getItem("efa_token");
  const rawUser = localStorage.getItem("efa_user");
  const user = rawUser ? (JSON.parse(rawUser) as AuthState["user"]) : null;
  return { token: token || null, user: user || null };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<AuthState>(() => readBootState());

  React.useEffect(() => {
    // Ensure axios has the token after refresh
    setAuthToken(state.token);
  }, [state.token]);

  async function signup(input: { email: string; password: string; handle: string }) {
    // Expect backend to return { token, user } or { accessToken, user }
    const res = await api.post("/auth/signup", input);
    const token = res.data?.token || res.data?.accessToken;
    const user = res.data?.user || null;

    if (!token) throw new Error("Signup succeeded but no token returned by server.");

    setAuthToken(token);
    if (user) localStorage.setItem("efa_user", JSON.stringify(user));

    setState({ token, user });
  }

  async function signin(input: { email: string; password: string }) {
    const res = await api.post("/auth/login", input);
    const token = res.data?.token || res.data?.accessToken;
    const user = res.data?.user || null;

    if (!token) throw new Error("Login succeeded but no token returned by server.");

    setAuthToken(token);
    if (user) localStorage.setItem("efa_user", JSON.stringify(user));

    setState({ token, user });
  }

  function signout() {
    setAuthToken(null);
    localStorage.removeItem("efa_user");
    setState({ token: null, user: null });
  }

  const value: AuthContextValue = {
    ...state,
    signup,
    signin,
    signout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider />");
  return ctx;
}