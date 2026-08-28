import React from "react";
import { RuneFigure } from "./RuneFigure.jsx";

export function PageHeader({ theme }) {
  return (
    <header
      className="relative overflow-hidden border-b px-5 pb-8 sm:px-8 min-[1100px]:px-11 min-[1100px]:pb-10"
      style={{ background: theme.tint, borderColor: "var(--color-divider)", paddingTop: 52 }}
    >
      <div
        className="pointer-events-none absolute -top-12 -right-9 h-[250px] w-[250px] rounded-full opacity-[0.13]"
        style={{ background: theme.accent }}
      />
      <RuneFigure
        runeKey={theme.rune}
        color={theme.accent}
        width={2.5}
        className="pointer-events-none absolute right-16 top-11 hidden h-[158px] w-[158px] opacity-40 sm:block"
      />
      <div className="relative flex max-w-3xl flex-col gap-3">
        <div className="text-[11.5px] uppercase tracking-[0.18em]" style={{ color: theme.deep }}>{theme.kicker}</div>
        <h1 className="m-0 text-[32px] leading-[1.06] tracking-tight sm:text-[38px] min-[1100px]:text-[46px]" style={{ textWrap: "pretty" }}>{theme.title}</h1>
        <p className="m-0 max-w-[56ch] text-[16.5px] leading-relaxed text-neutral-700" style={{ textWrap: "pretty" }}>{theme.blurb}</p>
      </div>
    </header>
  );
}
