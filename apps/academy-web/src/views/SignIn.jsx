import React from "react";
import { useAuth } from "../state/auth.jsx";
import { useNavigate } from "react-router-dom";
import { RuneFigure } from "../ui/components/RuneFigure.jsx";

export function SignIn() {
  const { login, signup, loading, error, clearError, user } = useAuth();
  const nav = useNavigate();
  const [mode, setMode] = React.useState("login");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  React.useEffect(() => { if (user) nav("/", { replace: true }); }, [user, nav]);

  const submit = async (e) => {
    e.preventDefault();
    clearError();
    try {
      if (mode === "login") await login(email, password);
      else await signup(email, password);
    } catch { /* handled via state */ }
  };

  return (
    <div className="max-w-[470px]">
      <RuneFigure runeKey="gebo" color="var(--pa)" width={3.5} className="mb-5 h-[74px] w-[74px]" />

      <form onSubmit={submit} className="card flex flex-col gap-4 p-8 shadow-md">
        <div className="flex gap-1 rounded-full bg-neutral-200 p-1">
          {[["login", "Sign in"], ["signup", "Create account"]].map(([value, label]) => (
            <button key={value} type="button" onClick={() => { setMode(value); clearError(); }}
              className={`flex-1 rounded-full py-2 text-sm ${mode === value ? "bg-neutral-100 font-semibold text-accent-800" : "text-neutral-700"}`}>
              {label}
            </button>
          ))}
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] uppercase tracking-wider text-neutral-700">Email</span>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="input" placeholder="you@domain.com" required />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] uppercase tracking-wider text-neutral-700">Password</span>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="input" placeholder="at least 8 characters" minLength={8} required />
        </label>

        {error ? <div className="rounded-md bg-accent-200 px-4 py-3 text-sm text-accent-800">{error}</div> : null}

        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? "Working…" : mode === "login" ? "Sign in" : "Create account"}
        </button>
        <button type="button" className="btn btn-ghost self-start" onClick={() => setMode((m) => (m === "login" ? "signup" : "login"))}>
          {mode === "login" ? "Need an account?" : "Already have an account?"}
        </button>
      </form>
    </div>
  );
}
