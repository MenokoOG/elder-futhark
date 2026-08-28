import React from "react";
import { api } from "../lib/api";
import { byKey } from "../lib/elderFuthark";
import { Button } from "../ui/components/Button.jsx";
import { IntervalCurve } from "../ui/components/graphics.jsx";
import { Link } from "react-router-dom";

export function Study() {
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [idx, setIdx] = React.useState(0);
  const [status, setStatus] = React.useState(null);
  const current = items[idx] || null;
  const rune = current ? byKey(current.runeKey) : null;

  const load = React.useCallback(async () => {
    setLoading(true); setStatus(null);
    try {
      const res = await api.get("/study/due");
      setItems(res.data?.items || []); setIdx(0);
    } catch { setStatus("Could not load due items."); }
    finally { setLoading(false); }
  }, []);

  React.useEffect(() => { load(); }, [load]);

  const rate = async (quality) => {
    if (!current) return;
    setStatus(null);
    try {
      await api.post("/study/rate", { runeKey: current.runeKey, quality });
      setStatus("Saved");
      setItems(items.filter((_, i) => i !== idx));
      setIdx(0);
    } catch { setStatus("Save failed."); }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <span className="tag tag-sage">{items.length} due</span>
        <Button onClick={load} disabled={loading}>{loading ? "Loading…" : "Refresh queue"}</Button>
        {status ? <span className="text-[13.5px]" style={{ color: "var(--pd)" }}>{status}</span> : null}
      </div>

      <section className="card flex flex-wrap items-center gap-6" style={{ background: "var(--pt)" }}>
        <IntervalCurve />
        <div className="max-w-[34ch]">
          <div className="text-[10.5px] uppercase tracking-[0.14em]" style={{ color: "var(--pd)" }}>Interval growth</div>
          <div className="text-sm leading-relaxed text-neutral-700">
            Each clean recall roughly doubles the wait: one day, two, four, and on to nine weeks. Miss one and it drops back to the start.
          </div>
        </div>
      </section>

      {current ? (
        <div className="card flex flex-col items-center gap-4 py-11">
          <div className="text-[11.5px] uppercase tracking-[0.14em] text-neutral-700">
            Due {new Date(current.dueAt).toLocaleString()}
          </div>
          <div className="grid h-[178px] w-[178px] place-items-center rounded-full text-[108px] leading-none"
            style={{ background: "var(--pt)", color: "var(--pd)" }}>{rune?.glyph || "?"}</div>
          <div className="font-heading text-[30px]">{rune?.name || current.runeKey}</div>
          <div className="text-[15px] text-neutral-700">{rune?.phonetic} · {(rune?.meaning || []).join(", ")}</div>
          <div className="mt-2 flex gap-2">
            {[0, 1, 2, 3, 4, 5].map((q) => (
              <button key={q} onClick={() => rate(q)}
                className="h-[46px] w-[46px] rounded-full border border-sage-300 bg-neutral-100 text-base text-sage-800 hover:bg-sage-200">{q}</button>
            ))}
          </div>
          <div className="text-[12.5px] text-neutral-700">SM-2 style scheduling. 0 blank → 5 perfect.</div>
        </div>
      ) : (
        <div className="card flex flex-col items-start gap-3 py-11" style={{ background: "#f0fae1" }}>
          <span className="text-[44px] text-sage-700">ᛃ</span>
          <div className="font-heading text-[27px]">All caught up</div>
          <p className="m-0 leading-relaxed text-neutral-700">Nothing due right now. Decks or a quiz will keep the momentum.</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link to="/flashcards" className="btn btn-primary">Open decks</Link>
            <Link to="/quiz" className="btn btn-ghost">Take a quiz</Link>
          </div>
        </div>
      )}
    </div>
  );
}
