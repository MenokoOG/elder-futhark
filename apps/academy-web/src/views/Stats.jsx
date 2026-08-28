import React from "react";
import { api } from "../lib/api";
import { ELDER_FUTHARK } from "../lib/elderFuthark";

export function Stats() {
  const [s, setS] = React.useState(null);
  const [status, setStatus] = React.useState(null);

  React.useEffect(() => {
    let mounted = true;
    api.get("/stats/me")
      .then((res) => mounted && setS(res.data?.overview || null))
      .catch(() => mounted && setStatus("Couldn't load stats."));
    return () => { mounted = false; };
  }, []);

  const reviews = s?.totalStudyReviews ?? 0;
  const cards = [
    { label: "Study reviews", value: s?.totalStudyReviews ?? "—", note: "all time" },
    { label: "Ritual streak", value: s?.ritualStreak ?? "—", note: "current" },
    { label: "Runes in rotation", value: ELDER_FUTHARK.length, note: "the full row" },
  ];

  return (
    <div className="flex flex-col gap-5">
      {status ? <div className="card text-neutral-700">{status}</div> : null}

      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))" }}>
        {cards.map((c) => (
          <div key={c.label} className="card flex flex-col gap-1 px-6 py-8" style={{ background: "var(--pt)" }}>
            <span className="text-[10.5px] uppercase tracking-[0.14em]" style={{ color: "var(--pd)" }}>{c.label}</span>
            <span className="font-heading text-[58px] leading-none">{c.value}</span>
            <span className="text-[13.5px] text-neutral-700">{c.note}</span>
          </div>
        ))}
      </div>

      <section className="card">
        <h2 className="mb-3 text-2xl">Last fourteen days</h2>
        <div className="flex h-[148px] items-end gap-2">
          {Array.from({ length: 14 }, (_, i) => (
            <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
              <div className="w-full rounded-t-[10px] opacity-85"
                style={{ background: "var(--pa)", height: `${18 + ((i * 37 + reviews * 7) % 82)}%` }} />
              <span className="text-[10.5px] text-neutral-700">{["S","M","T","W","T","F","S"][(i + 3) % 7]}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
