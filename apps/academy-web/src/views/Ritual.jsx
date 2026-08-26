import React from "react";
import { Card } from "../ui/components/Card.jsx";
import { Button } from "../ui/components/Button.jsx";
import { api } from "../lib/api";
import { byKey } from "../lib/elderFuthark";

export function Ritual() {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [status, setStatus] = React.useState(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    setStatus(null);
    try {
      const res = await api.get("/ritual/rune-of-day");
      setData(res.data);
    } catch {
      setStatus("Could not load ritual.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { load(); }, [load]);

  const claim = async () => {
    setLoading(true);
    setStatus(null);
    try {
      const res = await api.post("/ritual/claim");
      setData(res.data);
      setStatus("Claimed ✅");
    } catch {
      setStatus("Claim failed.");
    } finally {
      setLoading(false);
    }
  };

  const rune = data ? byKey(data.runeKey) : null;

  return (
    <div className="space-y-4">
      <Card title="Daily Ritual">
        <div className="text-sm text-zinc-400">One rune per day. Claim it to build streak.</div>
      </Card>

      <Card title="Rune of the day">
        {!data ? (
          <div className="text-zinc-300">{loading ? "Loading..." : "No data"}</div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <div className="text-sm text-zinc-400">{data.isoDate}</div>
            <div className="text-8xl">{rune?.glyph || "?"}</div>
            <div className="text-2xl font-semibold">{rune?.name || data.runeKey}</div>
            <div className="text-zinc-300">{rune?.phonetic}</div>
            <div className="text-zinc-200">Meaning: {(rune?.meaning || []).join(", ")}</div>
            <div className="text-sm text-zinc-400">Streak: {data.streak}</div>

            <div className="mt-4 flex items-center gap-2">
              <Button onClick={claim} disabled={loading || data.claimedToday}>
                {data.claimedToday ? "Claimed today" : "Claim"}
              </Button>
              <Button onClick={load} disabled={loading}>Refresh</Button>
            </div>
            {status ? <div className="text-sm text-zinc-300">{status}</div> : null}
          </div>
        )}
      </Card>
    </div>
  );
}
