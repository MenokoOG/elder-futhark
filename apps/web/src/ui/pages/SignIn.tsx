import React from "react";
import { useAuth } from "../../lib/auth";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, Button } from "@efa/ui";

const ModeSchema = z.union([z.literal("login"), z.literal("signup")]);
type Mode = z.infer<typeof ModeSchema>;

const LoginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

const SignupFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  handle: z.string().min(2).max(32)
});

export function SignIn() {
  const { login, signup, token, handle } = useAuth();
  const [mode, setMode] = React.useState<Mode>("login");
  const [err, setErr] = React.useState<string | null>(null);

  const schema = mode === "login" ? LoginFormSchema : SignupFormSchema;

  const form = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues: mode === "login"
      ? { email: "", password: "" }
      : { email: "", password: "", handle: "" }
  });

  React.useEffect(() => {
    form.reset(mode === "login"
      ? { email: "", password: "" }
      : { email: "", password: "", handle: "" }
    );
    setErr(null);
  }, [mode]);

  async function onSubmit(values: any) {
    setErr(null);
    try {
      if (mode === "login") await login(values);
      else await signup(values);
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Auth failed");
    }
  }

  return (
    <div className="grid gap-4 md:max-w-xl">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight">Sign in</h2>
        <p className="text-sm text-white/60">JWT auth for progress + future features.</p>
      </div>

      {token && (
        <Card>
          <div className="text-sm text-white/70">
            Signed in as <span className="font-bold text-white">{handle ?? "Seer"}</span>
          </div>
        </Card>
      )}

      <Card>
        <div className="flex gap-2">
          <Button variant={mode === "login" ? "solid" : "ghost"} onClick={() => setMode("login")}>
            Login
          </Button>
          <Button variant={mode === "signup" ? "solid" : "ghost"} onClick={() => setMode("signup")}>
            Signup
          </Button>
        </div>

        <form className="mt-4 grid gap-3" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-1">
            <label className="text-xs text-white/60 font-mono">email</label>
            <input
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/40"
              {...form.register("email")}
            />
          </div>

          <div className="grid gap-1">
            <label className="text-xs text-white/60 font-mono">password</label>
            <input
              type="password"
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/40"
              {...form.register("password")}
            />
          </div>

          {mode === "signup" && (
            <div className="grid gap-1">
              <label className="text-xs text-white/60 font-mono">handle</label>
              <input
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/40"
                {...form.register("handle")}
              />
            </div>
          )}

          {err && <div className="text-sm text-red-300">{err}</div>}

          <Button type="submit">{mode === "login" ? "Login" : "Create account"}</Button>
        </form>
      </Card>
    </div>
  );
}