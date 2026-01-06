import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, Button } from "@efa/ui";
import { useAuth } from "../../lib/auth";

const ModeSchema = z.union([z.literal("login"), z.literal("signup")]);

const FormSchema = z.object({
  mode: ModeSchema,
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  handle: z.string().min(2, "Handle must be at least 2 characters").optional()
});

type FormValues = z.infer<typeof FormSchema>;

function prettyServerError(err: any): string {
  const data = err?.response?.data;
  if (!data) return err?.message || "Request failed";

  // your ZodValidationPipe throws: { message, details: flatten() }
  const msg = data.message || "Request failed";
  const fieldErrors = data.details?.fieldErrors;
  if (!fieldErrors) return msg;

  const lines: string[] = [];
  for (const [k, v] of Object.entries(fieldErrors)) {
    const arr = Array.isArray(v) ? v : [String(v)];
    lines.push(`${k}: ${arr.join(", ")}`);
  }
  return `${msg}\n${lines.join("\n")}`;
}

export function SignIn() {
  const auth = useAuth();
  const [serverError, setServerError] = React.useState<string>("");

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: { mode: "login", email: "", password: "", handle: "" }
  });

  const mode = form.watch("mode");

  async function onSubmit(values: FormValues) {
    setServerError("");

    try {
      if (values.mode === "signup") {
        await auth.signup({
          email: values.email,
          password: values.password,
          handle: (values.handle || "").trim()
        });
      } else {
        await auth.signin({
          email: values.email,
          password: values.password
        });
      }
    } catch (e: any) {
      setServerError(prettyServerError(e));
    }
  }

  return (
    <div className="mx-auto grid max-w-xl gap-4 px-4 py-10">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Account</h1>
        <p className="mt-1 text-sm text-white/60">
          Sign in to track streaks, spaced repetition progress, achievements, and lore unlocks.
        </p>
      </div>

      <Card>
        <form className="grid gap-3" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex gap-2">
            <button
              type="button"
              className={`rounded-xl px-3 py-2 text-sm border ${
                mode === "login" ? "border-white/30 bg-white/10" : "border-white/10 bg-white/5 hover:bg-white/10"
              }`}
              onClick={() => form.setValue("mode", "login")}
            >
              Login
            </button>
            <button
              type="button"
              className={`rounded-xl px-3 py-2 text-sm border ${
                mode === "signup" ? "border-white/30 bg-white/10" : "border-white/10 bg-white/5 hover:bg-white/10"
              }`}
              onClick={() => form.setValue("mode", "signup")}
            >
              Sign up
            </button>
          </div>

          <input type="hidden" {...form.register("mode")} />

          <label className="grid gap-1">
            <span className="text-xs text-white/60">Email</span>
            <input
              {...form.register("email")}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/40"
              placeholder="you@domain.com"
            />
            {form.formState.errors.email && (
              <div className="text-xs text-red-300">{form.formState.errors.email.message}</div>
            )}
          </label>

          {mode === "signup" && (
            <label className="grid gap-1">
              <span className="text-xs text-white/60">Handle</span>
              <input
                {...form.register("handle")}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/40"
                placeholder="m3n0ko0g"
              />
              {form.formState.errors.handle && (
                <div className="text-xs text-red-300">{form.formState.errors.handle.message}</div>
              )}
            </label>
          )}

          <label className="grid gap-1">
            <span className="text-xs text-white/60">Password</span>
            <input
              type="password"
              {...form.register("password")}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/40"
              placeholder="••••••••"
            />
            {form.formState.errors.password && (
              <div className="text-xs text-red-300">{form.formState.errors.password.message}</div>
            )}
          </label>

          {serverError && (
            <pre className="whitespace-pre-wrap rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-200">
              {serverError}
            </pre>
          )}

          <div className="mt-2 flex gap-2">
            <Button type="submit">{mode === "signup" ? "Create account" : "Sign in"}</Button>
            {auth.token && (
              <Button type="button" variant="ghost" onClick={() => auth.signout()}>
                Sign out
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}