import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/auth";

// If you use @efa/ui Button/Card, keep them; otherwise swap to basic HTML.
// Importing here as you already used them:
import { Card, Button } from "@efa/ui";

const Schema = z.object({
  mode: z.union([z.literal("login"), z.literal("signup")]),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

type FormValues = z.infer<typeof Schema>;

export function SignIn() {
  const nav = useNavigate();
  const { login, signup, loading, error, clearError, user } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(Schema),
    defaultValues: { mode: "login", email: "", password: "" }
  });

  React.useEffect(() => {
    if (user) nav("/progress"); // ✅ route that exists
  }, [user, nav]);

  async function onSubmit(values: FormValues) {
    clearError();
    const { email, password, mode } = values;

    try {
      if (mode === "signup") await signup(email, password);
      else await login(email, password);

      // after auth, go somewhere real:
      nav("/progress");
    } catch {
      // error is stored in context and shown below
    }
  }

  const mode = form.watch("mode");
  const fieldErr = form.formState.errors;

  return (
    <div className="mx-auto max-w-md px-6 py-10">
      <Card>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Welcome</h1>
            <div className="flex gap-2">
              <button
                type="button"
                className={`text-sm ${mode === "login" ? "opacity-100" : "opacity-60"}`}
                onClick={() => form.setValue("mode", "login")}
              >
                Login
              </button>
              <span className="opacity-40">|</span>
              <button
                type="button"
                className={`text-sm ${mode === "signup" ? "opacity-100" : "opacity-60"}`}
                onClick={() => form.setValue("mode", "signup")}
              >
                Signup
              </button>
            </div>
          </div>

          {error ? (
            <div className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm">
              {error}
            </div>
          ) : null}

          <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
            <input type="hidden" {...form.register("mode")} />

            <div className="space-y-1">
              <label className="text-sm opacity-80">Email</label>
              <input
                className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2"
                placeholder="you@example.com"
                autoComplete="email"
                {...form.register("email")}
              />
              {fieldErr.email?.message ? (
                <div className="text-xs text-red-300">{fieldErr.email.message}</div>
              ) : null}
            </div>

            <div className="space-y-1">
              <label className="text-sm opacity-80">Password</label>
              <input
                className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2"
                type="password"
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                {...form.register("password")}
              />
              {fieldErr.password?.message ? (
                <div className="text-xs text-red-300">{fieldErr.password.message}</div>
              ) : null}
            </div>

            {/* ✅ CRITICAL: type="submit" */}
            <Button type="submit" disabled={loading}>
              {loading ? "Working..." : mode === "signup" ? "Create account" : "Login"}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}