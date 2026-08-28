import React from "react";
import { api } from "../lib/api";
import { byKey, ELDER_FUTHARK } from "../lib/elderFuthark";
import { Button } from "../ui/components/Button.jsx";
import { DayWheel } from "../ui/components/graphics.jsx";
import { Link } from "react-router-dom";

export function Ritual() {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [status, setStatus] = React.useState(null);

  const load = React.useCallback(async () => {
    setLoading(true); setStatus(null);
    try { const res = await api.get("/ritual/rune-of-day"); setData(res.data); }
    catch { setStatus("Could not load ritual."); }
    finally { setLoading(false); }
  }, []);

  React.useEffect(() => { load(); }, [load]);

  const claim = async () => {
    setLoading(true); setStatus(null);
    try { const res = await api.post("/ritual/claim"); setData(res.data); setStatus("Claimed. Come back tomorrow."); }
    catch { setStatus("Claim failed."); }
    finally { setLoading(false); }
  };

  const rune = data ? byKey(data.runeKey) : null;
  const wheelIndex = rune ? ELDER_FUTHARK.findIndex((r) => r.key === rune.key) : 0;
  const streak = data?.streak || 0;

  return (
    <div className="grid items-start gap-6 min-[900px]:grid-cols-[minmax(0,1fr)_268px]">
      <div className="flex flex-col items-center gap-4 rounded-lg border p-8 py-13 shadow-sm"
        style={{ background: "radial-gradient(circle at 50% 22%, #ffe1d0, var(--pt) 70%)", borderColor: "var(--color-divider)", paddingTop: 52 }}>
        <div className="text-[11.5px] uppercase tracking-[0.16em]" style={{ color: "var(--pd)" }}>
          {data?.isoDate || new Date().toLocaleDateString()}
        </div>
        <DayWheel index={wheelIndex}>
          <div className="grid h-[190px] w-[190px] place-items-center rounded-full bg-neutral-100 text-[116px] leading-none shadow-md"
            style={{ color: "var(--pd)" }}>{rune?.glyph || (loading ? "" : "?")}</div>
        </DayWheel>
        <div className="font-heading text-[38px] leading-tight">{rune?.name || data?.runeKey || "—"}</div>
        <div className="text-base text-neutral-700">{rune ? `${rune.phonetic} · aett ${rune.aett}` : ""}</div>
        <div className="flex flex-wrap justify-center gap-1.5">
          {(rune?.meaning || []).map((m) => <span key={m} className="tag tag-accent">{m}</span>)}
        </div>
        <p className="m-0 mt-1 max-w-[42ch] text-center leading-relaxed text-neutral-700">{rune?.notes}</p>
        <div className="mt-2 flex gap-2">
          <Button variant="primary" onClick={claim} disabled={loading || data?.claimedToday}>
            {data?.claimedToday ? "Claimed today" : "Claim the rune"}
          </Button>
          <Link to="/study" className="btn btn-ghost">Review it</Link>
        </div>
        {status ? <div className="text-[13.5px]" style={{ color: "var(--pd)" }}>{status}</div> : null}
      </div>

      <aside className="card flex flex-col gap-4">
        <div>
          <div className="text-[10.5px] uppercase tracking-[0.14em] text-neutral-700">Streak</div>
          <div className="font-heading text-[52px] leading-tight" style={{ color: "var(--pd)" }}>{streak}</div>
          <div className="text-[13.5px] text-neutral-700">consecutive days claimed</div>
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {Array.from({ length: 14 }, (_, i) => (
            <span key={i} className={`aspect-square rounded-full ${i < Math.min(14, streak) ? "bg-accent-500" : "bg-neutral-300"}`} />
          ))}
        </div>
        <p className="m-0 text-[13.5px] leading-normal text-neutral-700">
          One rune per day. Claim it, sit with it, then send it to the study queue.
        </p>
      </aside>
    </div>
  );
}
