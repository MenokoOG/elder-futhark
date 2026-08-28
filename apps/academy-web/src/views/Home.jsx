import React from "react";
import { Link } from "react-router-dom";
import { RowPlate } from "../ui/components/graphics.jsx";
import { aettByNumber } from "@efa/futhark-aetts";
import { ELDER_FUTHARK } from "../lib/elderFuthark";
import { AETT_INK } from "../ui/theme.js";

const TILES = [
  { to: "/runes", glyph: "ᚱ", title: "The 24", body: "Every rune with its sound, meaning and aett.", ink: "#645c50" },
  { to: "/flashcards", glyph: "ᛃ", title: "Decks", body: "Flip cards by aett and rate your recall.", ink: "#728157" },
  { to: "/quiz", glyph: "ᛏ", title: "Quiz", body: "Glyph to name, name to glyph, meaning to rune.", ink: "#b2622d" },
  { to: "/tools/transliterate", glyph: "ᛚ", title: "Transliterate", body: "Latin in, runes out — and back again.", ink: "#8c491a" },
];

const STEPS = [
  "Start with Aett 1 — eight runes.",
  "Run the decks daily.",
  "Quiz until 80% is routine.",
  "Claim the daily rune and review it.",
];

export function Home() {
  return (
    <div className="flex flex-col gap-6">
      <RowPlate />

      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))" }}>
        {TILES.map((t) => (
          <Link key={t.to} to={t.to} className="card flex flex-col gap-2 transition hover:-translate-y-0.5 hover:shadow-md">
            <span className="text-[38px] leading-none" style={{ color: t.ink }}>{t.glyph}</span>
            <span className="font-heading text-xl">{t.title}</span>
            <span className="text-sm leading-normal text-neutral-700">{t.body}</span>
          </Link>
        ))}
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
        <section className="card">
          <h2 className="mb-1 text-2xl">Your path</h2>
          <p className="mb-4 text-sm text-neutral-700">Four steps, in order. Nothing clever about it.</p>
          <ol className="m-0 flex list-none flex-col gap-3 p-0">
            {STEPS.map((s, i) => (
              <li key={s} className="flex items-start gap-3">
                <span className="grid h-[30px] w-[30px] flex-none place-items-center rounded-full bg-accent-200 text-sm font-semibold text-accent-800">{i + 1}</span>
                <span className="pt-1 leading-normal">{s}</span>
              </li>
            ))}
          </ol>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link to="/flashcards" className="btn btn-primary">Open decks</Link>
            <Link to="/study" className="btn btn-secondary">Study queue</Link>
            <Link to="/ritual" className="btn btn-ghost">Daily ritual</Link>
          </div>
        </section>

        <section className="card" style={{ background: "#f0fae1" }}>
          <h2 className="mb-1 text-2xl">Three aetts</h2>
          <p className="mb-4 text-sm text-neutral-700">The row splits into three families of eight.</p>
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((n) => {
              const members = ELDER_FUTHARK.filter((r) => r.aett === n);
              return (
                <Link key={n} to="/runes" className="flex items-center gap-3 rounded-md border bg-neutral-100 px-4 py-3 hover:border-sage-400"
                  style={{ borderColor: "var(--color-divider)" }}>
                  <span className="text-2xl tracking-wide" style={{ color: AETT_INK[n - 1] }}>{members.map((r) => r.glyph).join("")}</span>
                  <span className="flex-1">
                    <span className="block text-[14.5px] font-semibold">{aettByNumber(n)?.name ?? `Aett ${n}`}</span>
                    <span className="block text-[13px] text-neutral-700">{members.slice(0, 3).map((r) => r.name).join(", ")} …</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
