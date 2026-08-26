import React from "react";

export function Button({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2 font-medium hover:bg-zinc-700 disabled:opacity-60 ${className}`}
    >
      {children}
    </button>
  );
}
