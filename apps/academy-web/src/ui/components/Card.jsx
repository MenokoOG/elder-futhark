import React from "react";

export function Card({ title, children, className = "" }) {
  return (
    <section className={`rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 ${className}`}>
      {title ? <h2 className="mb-3 text-lg font-semibold">{title}</h2> : null}
      {children}
    </section>
  );
}
