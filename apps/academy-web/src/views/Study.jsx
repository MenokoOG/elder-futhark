import React from "react";
import { Card } from "../ui/components/Card.jsx";
import { Button } from "../ui/components/Button.jsx";
import { api } from "../lib/api";
import { byKey } from "../lib/elderFuthark";

function formatDue(dueAt) {
  const d = new Date(dueAt);
  return d.toLocaleString();
}

export function Study() {
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [idx, setIdx] = React.useState(0);
  const [status, setStatus] = React.useState(null);
  const current = items[idx] || null;
  const rune = current ? byKey(current.runeKey) : null;

  const load = React.useCallback(async () => {
    setLoading(true);
    setStatus(null);
    try {
      const res = await api.get("/study/due");
      setItems(res.data?.items || []);
      setIdx(0);
    } catch {
      setStatus("Could not load due items.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { load(); }, [load]);

  const rate = async (quality) => {
    if (!current) return;
    setStatus(null);
    try {
      await api.post("/study/rate", { runeKey: current.runeKey, quality });
      setStatus("Saved ✅");
      const nextItems = items.filter((_, i) => i !== idx);
      setItems(nextItems);
      setIdx(0);
    } catch {
      setStatus("Save failed.");
    }
  };

  return (
    <div className="space-y-4">
      <Card title="Study queue">
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={load} disabled={loading}>{loading ? "Loading..." : "Refresh"}</Button>
          <div className="text-sm text-zinc-300">{items.length} due</div>
          {status ? <div className="text-sm text-zinc-300">{status}</div> : null}
        </div>
      </Card>

      {!current ? (
        <Card title="All caught up 🎉">
          <p className="text-zinc-300">No due items right now. Hit Decks or Quiz to keep momentum.</p>
        </Card>
      ) : (
        <Card title={`Review: ${current.runeKey}`}>
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <div className="text-8xl">{rune?.glyph || "?"}</div>
            <div className="text-xl font-semibold">{rune?.name || current.runeKey}</div>
            <div className="text-sm text-zinc-300">Phonetic: {rune?.phonetic || "—"}</div>
            <div className="text-sm text-zinc-200">Meaning: {(rune?.meaning || []).join(", ")}</div>
            <div className="text-xs text-zinc-500">Due: {formatDue(current.dueAt)}</div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              {[0,1,2,3,4,5].map(q => (
                <Button key={q} onClick={() => rate(q)} className="text-sm">{q}</Button>
              ))}
            </div>
            <div className="text-xs text-zinc-500">0 (blank) → 5 (perfect). Uses SM-2 style scheduling.</div>
          </div>
        </Card>
      )}
    </div>
  );
}
