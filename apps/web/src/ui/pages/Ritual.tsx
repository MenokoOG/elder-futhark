import React from "react";
import { Card, Button } from "@efa/ui";
import { useAuth } from "../../lib/auth";
import { api } from "../../lib/api";
import { ELDER_FUTHARK } from "@efa/shared";import { now } from "three/examples/jsm/libs/tween.module.js";


function runeByKey(key: string) {
  return ELDER_FUTHARK.find(r => r.key === key);
}

export function RitualPage() {
  const { token } = useAuth();
  const [state, setState] = React.useState<any | null>(null);
  const [busy, setBusy] = React.useState(false);

  async function load() {
    if (!token) return;
    const res = await api.get("/ritual/rune-of-day");
    setState(res.data);
  }

  React.useEffect(() => {
    void load();
  }, [token]);

  async function claim() {
    setBusy(true);
    try {
      const now = new Date();
      const isoDate = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`;
      const res = await api.post("/ritual/claim", { isoDate });
      setState(res.data);
    } finally {
      setBusy(false);
    }
  }

  if (!token) {
    return (
      <Card>
        <div className="text-xl font-bold">Daily Ritual</div>
        <p className="mt-2 text-white/70">Sign in to claim Rune of the Day and build streaks + achievements.</p>
      </Card>
    );
  }

  const r = state?.runeKey ? runeByKey(state.runeKey) : null;

  return (
    <div className="grid gap-4">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight">Daily Ritual</h2>
        <p className="text-sm text-white/60">Claim Rune of the Day (streaks + unlocks). Built for free-tier persistence.</p>
      </div>

      <Card>
        {!state ? (
          <div className="text-white/60">Loading…</div>
        ) : (
          <div className="grid gap-3">
            <div className="flex items-center justify-between">
              <div className="text-xs text-white/60 font-mono">date {state.isoDate}</div>
              <div className="text-xs text-white/60 font-mono">streak {state.streak}</div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-7xl rune-glow">{r?.glyph ?? "?"}</div>
              <div>
                <div className="text-xl font-bold">{r?.name ?? state.runeKey}</div>
                <div className="text-xs text-white/60 font-mono">{r?.phonetic}</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(r?.meaning ?? []).map(m => (
                    <span key={m} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-sm text-white/75">{r?.notes}</p>

            <div className="flex gap-2">
              <Button onClick={claim} disabled={busy || state.claimedToday}>
                {state.claimedToday ? "Claimed ✅" : busy ? "Claiming..." : "Claim"}
              </Button>
              <Button variant="ghost" onClick={load}>Refresh</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}