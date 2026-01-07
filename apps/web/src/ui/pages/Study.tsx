import React from "react";
import { Card, Button } from "@efa/ui";
import { useAuth } from "../../lib/auth";
import { api } from "../../lib/api";
import { ELDER_FUTHARK } from "@efa/shared";
function runeByKey(key: string) {
  return ELDER_FUTHARK.find(r => r.key === key);
}

const grades: Array<{ g: 0|1|2|3|4|5; label: string }> = [
  { g: 0, label: "0 blackout" },
  { g: 1, label: "1 wrong" },
  { g: 2, label: "2 hard" },
  { g: 3, label: "3 ok" },
  { g: 4, label: "4 good" },
  { g: 5, label: "5 perfect" }
];

export function StudyPage() {
  const { token } = useAuth();
  const [item, setItem] = React.useState<any | null>(null);
  const [reveal, setReveal] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  async function next() {
    setBusy(true);
    try {
      const res = await api.get("/study/next");
      setItem(res.data);
      setReveal(false);
    } finally {
      setBusy(false);
    }
  }

  React.useEffect(() => {
    if (token) void next();
  }, [token]);

  async function grade(g: 0|1|2|3|4|5) {
    if (!item) return;
    setBusy(true);
    try {
      await api.post("/study/grade", { runeKey: item.runeKey, grade: g });
      await next();
    } finally {
      setBusy(false);
    }
  }

  if (!token) {
    return (
      <Card>
        <div className="text-xl font-bold">Study (SM-2)</div>
        <p className="mt-2 text-white/70">Sign in to use spaced repetition (SM-2) with Mongo persistence.</p>
      </Card>
    );
  }

  const r = item?.runeKey ? runeByKey(item.runeKey) : null;

  return (
    <div className="grid gap-4">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight">Study Engine (SM-2)</h2>
        <p className="text-sm text-white/60">True spaced repetition scheduling. Grade 0–5 updates due dates.</p>
      </div>

      <Card>
        {!item ? (
          <div className="text-white/60">Loading…</div>
        ) : (
          <div className="grid gap-3">
            <div className="flex items-center justify-between">
              <div className="text-xs text-white/60 font-mono">due {new Date(item.dueAt).toLocaleString()}</div>
              <div className="text-xs text-white/60 font-mono">
                reps {item.repetitions} • ivl {item.intervalDays}d • ef {Number(item.easeFactor).toFixed(2)}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-7xl rune-glow">{r?.glyph ?? "?"}</div>
              <div>
                <div className="text-xl font-bold">{r?.name ?? item.runeKey}</div>
                <div className="text-xs text-white/60 font-mono">phonetic {r?.phonetic} • aett {r?.aett}</div>
              </div>
            </div>

            {!reveal ? (
              <Button onClick={() => setReveal(true)} disabled={busy}>Reveal</Button>
            ) : (
              <>
                <div className="flex flex-wrap gap-2">
                  {(r?.meaning ?? []).map(m => (
                    <span key={m} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs">
                      {m}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-white/75">{r?.notes}</p>
                <div className="flex flex-wrap gap-2">
                  {grades.map(x => (
                    <Button key={x.g} variant={x.g >= 4 ? "solid" : "ghost"} onClick={() => grade(x.g)} disabled={busy}>
                      {x.label}
                    </Button>
                  ))}
                  <Button variant="ghost" onClick={next} disabled={busy}>Skip</Button>
                </div>
              </>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}