import React from "react";

export function Card({ title, kicker, children, className = "", style }) {
  return (
    <section className={`card ${className}`} style={style}>
      {kicker ? <div className="mb-1 text-[10.5px] uppercase tracking-[0.14em] text-neutral-700">{kicker}</div> : null}
      {title ? <h2 className="mb-3 text-2xl">{title}</h2> : null}
      {children}
    </section>
  );
}

export function StatTile({ label, value, note, color, tint }) {
  return (
    <div className="card flex flex-col gap-1" style={tint ? { background: tint } : undefined}>
      <span className="text-[10.5px] uppercase tracking-[0.14em] text-neutral-700">{label}</span>
      <span className="font-heading text-[44px] leading-none" style={color ? { color } : undefined}>{value}</span>
      {note ? <span className="text-sm text-neutral-700">{note}</span> : null}
    </div>
  );
}
