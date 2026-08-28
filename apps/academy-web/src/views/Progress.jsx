import React from "react";
import { aettByNumber } from "@efa/futhark-aetts";
import { api } from "../lib/api";
import { StatTile } from "../ui/components/Card.jsx";
import { ELDER_FUTHARK, byKey } from "../lib/elderFuthark";

export function Progress() {
  const [p, setP] = React.useState(null);
  const [status, setStatus] = React.useState(null);

  React.useEffect(() => {
    let mounted = true;
    api.get("/progress/me")
      .then((res) => mounted && setP(res.data?.progress || null))
      .catch(() => mounted && setStatus("Couldn't load progress."));
    return () => { mounted = false; };
  }, []);

  const last = p?.lastRuneKey ? byKey(p.lastRuneKey) : null;
  const reviews = p?.totalStudyReviews || 0;
  const aettCount = (n) => ELDER_FUTHARK.filter((r) => r.aett === n).length;

  return (
    <div className="flex flex-col gap-5">
      {status ? <div className="card text-neutral-700">{status}</div> : null}

      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))" }}>
        <StatTile label="Ritual streak" value={p?.ritualStreak || 0} note="days in a row" color="#b2622d" />
        <StatTile label="Study reviews" value={reviews} note="cards rated" color="#56633f" />
        <StatTile label="Lessons unlocked" value={(p?.unlockedLessonKeys || []).length} note="from lore" color="#56633f" />
        <StatTile label="Last ritual rune" value={last?.glyph || "—"} note={last?.name || ""} color="#b2622d" />
      </div>

      <section className="card" style={{ background: "#e1eecc" }}>
        <h2 className="mb-4 text-2xl">Aett coverage</h2>
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((n) => {
            const total = aettCount(n);
            const known = Math.max(0, Math.min(total, Math.round(reviews / 3) - (n - 1) * 4));
            return (
              <div key={n} className="flex flex-col gap-1.5">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold">{aettByNumber(n)?.name ?? `Aett ${n}`}</span>
                  <span className="text-neutral-700">{known} / {total}</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-neutral-200">
                  <div className="h-full rounded-full bg-sage-500" style={{ width: `${total ? (known / total) * 100 : 0}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
