import React from "react";
import { Link } from "react-router-dom";
import { ELDER_FUTHARK } from "../../lib/elderFuthark.js";
import { AETT_INK } from "../theme.js";
import { RuneFigure } from "./RuneFigure.jsx";

/** Home: all 24 runes as stroke figures, tinted by aett. */
export function RowPlate() {
  return (
    <section className="card">
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="m-0 text-2xl">The whole row</h2>
        <span className="text-[12.5px] text-neutral-700">Stroke geometry · aett 1 terracotta, aett 2 sage, aett 3 stone</span>
      </div>
      <div className="grid grid-cols-8 gap-3">
        {ELDER_FUTHARK.map((r) => (
          <Link key={r.key} to="/runes" title={r.name}
            className="flex flex-col items-center gap-1.5 rounded-md border border-transparent px-1 py-3 hover:border-neutral-300 hover:bg-neutral-200">
            <RuneFigure runeKey={r.key} color={AETT_INK[r.aett - 1]} width={4} className="aspect-square w-full max-w-[42px]" />
            <span className="text-[11px] text-neutral-700">{r.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

/** Ritual: 24-spoke wheel, one spoke per rune, today marked. */
export function DayWheel({ index, size = 262, children }) {
  const spokes = Array.from({ length: 24 }, (_, i) => {
    const ang = (i / 24) * Math.PI * 2 - Math.PI / 2;
    const today = i === index;
    const inner = today ? 0.52 : 0.68;
    const outer = today ? 0.98 : 0.86;
    return {
      x1: 50 + Math.cos(ang) * 50 * inner, y1: 50 + Math.sin(ang) * 50 * inner,
      x2: 50 + Math.cos(ang) * 50 * outer, y2: 50 + Math.sin(ang) * 50 * outer,
      w: today ? 3.4 : 1.4,
      ink: today ? "var(--pd)" : i < index ? "#d67f48" : "#c0b6a5",
    };
  });
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
        {spokes.map((s, i) => (
          <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke={s.ink} strokeWidth={s.w} strokeLinecap="round" />
        ))}
      </svg>
      {children}
    </div>
  );
}

/** Study: SM-2 interval growth. */
export function IntervalCurve() {
  const intervals = [1, 2, 4, 8, 16, 32, 64];
  const pt = (v, i) => [(i / (intervals.length - 1)) * 100, 100 - (Math.log2(v) / 6) * 92];
  const pts = intervals.map(pt);
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-32 min-w-[240px] flex-1 overflow-visible" aria-hidden="true">
      <polyline points={pts.map((p) => p.join(",")).join(" ")} fill="none" stroke="var(--pd)" strokeWidth={1.6}
        strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={2.6} fill="#f9f4ed" stroke="var(--pd)" strokeWidth={1.4} vectorEffect="non-scaling-stroke" />
      ))}
    </svg>
  );
}

/** Quiz: score ring. */
export function ScoreRing({ value, total, size = 62 }) {
  const frac = total ? value / total : 0;
  const circ = 2 * Math.PI * 42;
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90" aria-hidden="true">
        <circle cx="50" cy="50" r="42" fill="none" stroke="#dcd3c4" strokeWidth={9} />
        <circle cx="50" cy="50" r="42" fill="none" stroke="var(--pa)" strokeWidth={9} strokeLinecap="round"
          strokeDasharray={`${circ * frac} ${circ}`} style={{ transition: "stroke-dasharray 300ms ease" }} />
      </svg>
      <span className="relative text-[13px] font-semibold" style={{ color: "var(--pd)" }}>{Math.round(frac * 100)}%</span>
    </div>
  );
}

/** Lore: centuries the row was in use. */
export function CenturyTimeline() {
  const marks = [
    { label: "2c", note: "earliest finds" }, { label: "3c", note: "" }, { label: "4c", note: "" },
    { label: "5c", note: "bracteates" }, { label: "6c", note: "" }, { label: "7c", note: "" },
    { label: "8c", note: "younger futhark follows" },
  ];
  return (
    <section className="card">
      <div className="mb-5 text-[10.5px] uppercase tracking-[0.14em] text-neutral-700">When the row was in use</div>
      <div className="relative grid grid-cols-7 items-end gap-2">
        <div className="absolute bottom-8 left-0 right-0 h-[3px] rounded-full bg-sage-300" />
        {marks.map((m) => (
          <div key={m.label} className="relative flex flex-col items-center gap-2">
            <span className="min-h-[34px] text-center text-xs leading-snug text-neutral-700">{m.note}</span>
            <span className="h-[15px] w-[15px] rounded-full bg-sage-600" style={{ boxShadow: "0 0 0 5px #f0fae1" }} />
            <span className="font-heading text-[19px] text-sage-800">{m.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Gods: one cluster per group, a dot per named figure. */
export function GodClusters({ items }) {
  const groups = ["Aesir", "Vanir", "Jotnar", "Beings"];
  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
      {groups.map((name, gi) => {
        const members = items.filter((g) => (g.group || "Other") === name);
        if (!members.length) return null;
        const ink = gi % 2 === 0 ? "#b2622d" : "#728157";
        const tint = gi % 2 === 0 ? "#ffe1d0" : "#e1eecc";
        return (
          <div key={name} className="flex items-center gap-4 rounded-lg p-5" style={{ background: tint }}>
            <svg viewBox="0 0 100 76" className="h-[60px] w-[78px] flex-none" aria-hidden="true">
              {members.map((m, i) => (
                <circle key={m.key || i} cx={26 + (i % 3) * 24} cy={26 + Math.floor(i / 3) * 24} r={9} fill={ink} opacity={0.75} />
              ))}
            </svg>
            <div>
              <div className="font-heading text-[21px]">{name}</div>
              <div className="text-[12.5px] text-neutral-700">{members.length} named</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Transliterate: the letter→rune pairs actually used in the current text. */
export function MappingRibbon({ map }) {
  const seen = new Set();
  const pairs = [];
  for (const m of map) {
    if (m.type !== "rune" || seen.has(m.key)) continue;
    seen.add(m.key);
    const r = ELDER_FUTHARK.find((x) => x.key === m.key);
    if (r) pairs.push({ latin: m.latin, glyph: r.glyph, name: r.name });
    if (pairs.length >= 12) break;
  }
  return (
    <section className="card">
      <div className="mb-4 text-[10.5px] uppercase tracking-[0.14em] text-neutral-700">Mapping used in this text</div>
      <div className="flex flex-wrap gap-3">
        {pairs.map((p) => (
          <div key={p.name} className="flex items-center gap-2 rounded-full px-4 py-2" style={{ background: "var(--pt)" }}>
            <span className="text-sm font-semibold" style={{ color: "var(--pd)" }}>{p.latin}</span>
            <span className="text-xs text-neutral-700">→</span>
            <span className="text-[21px] leading-none">{p.glyph}</span>
            <span className="text-[12.5px] text-neutral-700">{p.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
