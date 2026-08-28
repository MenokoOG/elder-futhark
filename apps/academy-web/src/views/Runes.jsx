import React from "react";
import { AETTS, aettByNumber } from "@efa/futhark-aetts";
import { api } from "../lib/api";
import { ELDER_FUTHARK } from "../lib/elderFuthark";

// Pill filter labels come from the canonical aett module, not hardcoded
// numbers — the names, themes and groupings shipped in @efa/futhark-aetts.
const AETT_FILTERS = [["", "All"], ...AETTS.map((a) => [String(a.number), a.name])];

export function Runes() {
  const [q, setQ] = React.useState("");
  const [aett, setAett] = React.useState("");
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (q.trim()) params.q = q.trim();
      if (aett) params.aett = Number(aett);
      const res = api?.get ? await api.get("/runes", { params }) : null;
      if (!res) throw new Error("API unavailable");
      const remoteItems = res?.data?.items || [];
      setItems(remoteItems.map((r) => ({ ...r, meaning: Array.isArray(r.meaning) ? r.meaning : [r.meaning].filter(Boolean) })));
    } catch (err) {
      if (err?.response?.status === 304) return;
      const search = q.trim().toLowerCase();
      setItems(
        ELDER_FUTHARK.filter((r) => {
          const parts = Array.isArray(r.meaning) ? r.meaning : [r.meaning].filter(Boolean);
          const hay = (r.name + r.key + r.phonetic + parts.join(" ")).toLowerCase();
          return (!aett || Number(r.aett) === Number(aett)) && (!search || hay.includes(search));
        }).map((r) => ({ ...r, meaning: Array.isArray(r.meaning) ? r.meaning : [r.meaning].filter(Boolean) }))
      );
    } finally {
      setLoading(false);
    }
  }, [q, aett]);

  React.useEffect(() => { load(); }, [load]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, sound or meaning"
          className="input min-w-[240px] flex-1" />
        <div className="flex gap-1 rounded-full bg-neutral-200 p-1">
          {AETT_FILTERS.map(([value, label]) => (
            <button key={label} onClick={() => setAett(value)}
              className={`rounded-full px-4 py-1.5 text-[13.5px] ${aett === value ? "bg-neutral-100 font-semibold" : "text-neutral-700"}`}
              style={aett === value ? { color: "var(--pd)" } : undefined}>
              {label}
            </button>
          ))}
        </div>
        <span className="text-[13px] text-neutral-700">{loading ? "Loading…" : `${items.length} of 24`}</span>
      </div>

      {aett ? (
        <p className="m-0 -mt-1 max-w-[72ch] text-[13.5px] leading-relaxed text-neutral-700">
          <span className="font-semibold" style={{ color: "var(--pd)" }}>{aettByNumber(aett)?.theme}.</span>{" "}
          {aettByNumber(aett)?.focus}{" "}
          <span className="text-neutral-700">A modern teaching frame, not attested historical fact.</span>
        </p>
      ) : null}

      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(268px, 1fr))" }}>
        {items.map((r) => (
          <article key={r.key} className="card flex flex-col gap-3 transition hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[10.5px] uppercase tracking-[0.14em] text-neutral-700">
                  {aettByNumber(r.aett)?.name ?? `Aett ${r.aett}`}
                </div>
                <div className="font-heading text-[23px] leading-tight">{r.name}</div>
                <div className="text-[13.5px] text-neutral-700">{r.phonetic} · {r.key}</div>
              </div>
              <div className="grid h-[62px] w-[62px] flex-none place-items-center rounded-full text-[34px] leading-none"
                style={{ background: "var(--pt)", color: "var(--pd)" }}>{r.glyph}</div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(r.meaning || []).map((m) => <span key={m} className="tag tag-outline">{m}</span>)}
            </div>
            {r.notes ? <div className="text-[13.5px] leading-normal text-neutral-700">{r.notes}</div> : null}
          </article>
        ))}
      </div>
    </div>
  );
}
