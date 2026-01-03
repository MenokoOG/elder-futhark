import * as React from "react";
import { cn } from "../lib/cn";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "ghost";
};

export function Button({ className, variant = "solid", ...props }: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black";
  const solid =
    "bg-white text-black hover:bg-zinc-200 focus:ring-white";
  const ghost =
    "bg-transparent text-white hover:bg-white/10 focus:ring-white";

  return (
    <button
      className={cn(base, variant === "solid" ? solid : ghost, className)}
      {...props}
    />
  );
}