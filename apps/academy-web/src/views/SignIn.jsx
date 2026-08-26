import React from "react";
import { Card } from "../ui/components/Card.jsx";
import { Button } from "../ui/components/Button.jsx";
import { useAuth } from "../state/auth.jsx";
import { useNavigate } from "react-router-dom";

export function SignIn() {
  const { login, signup, loading, error, clearError, user } = useAuth();
  const nav = useNavigate();
  const [mode, setMode] = React.useState("login");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  React.useEffect(() => {
    if (user) nav("/", { replace: true });
  }, [user, nav]);

  const submit = async (e) => {
    e.preventDefault();
    clearError();
    try {
      if (mode === "login") await login(email, password);
      else await signup(email, password);
    } catch {
      // handled via state
    }
  };

  return (
    <div className="mx-auto max-w-lg">
      <Card title={mode === "login" ? "Sign in" : "Create account"}>
        <form onSubmit={submit} className="space-y-3">
          <label className="block">
            <div className="mb-1 text-sm text-zinc-300">Email</div>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2"
              placeholder="you@domain.com"
              required
            />
          </label>

          <label className="block">
            <div className="mb-1 text-sm text-zinc-300">Password</div>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2"
              placeholder="min 8 chars"
              minLength={8}
              required
            />
          </label>

          {error ? <div className="rounded-xl border border-red-800 bg-red-950/40 p-3 text-sm text-red-200">{error}</div> : null}

          <div className="flex flex-wrap items-center gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Working..." : mode === "login" ? "Sign in" : "Create account"}
            </Button>
            <button
              type="button"
              className="text-sm text-zinc-300 underline underline-offset-4"
              onClick={() => setMode((m) => (m === "login" ? "signup" : "login"))}
            >
              {mode === "login" ? "Need an account?" : "Already have an account?"}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
