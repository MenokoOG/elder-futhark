import React from "react";
import { Card } from "../ui/components/Card.jsx";
import { api } from "../lib/api";
import { ELDER_FUTHARK } from "../lib/elderFuthark";

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
      setItems(
        remoteItems.map((r) => ({
          ...r,
          meaning: Array.isArray(r.meaning) ? r.meaning : [r.meaning].filter(Boolean),
        }))
      );
    } catch (err) {
      if (err?.response?.status === 304) return; // keep existing items
      // fallback: local
      const search = q.trim().toLowerCase();
      const local = ELDER_FUTHARK.filter((r) => {
        const meaningParts = Array.isArray(r.meaning) ? r.meaning : [r.meaning].filter(Boolean);
        const haystack = (r.name + r.key + r.phonetic + meaningParts.join(" ")).toLowerCase();
        return (!aett || Number(r.aett) === Number(aett)) && (!search || haystack.includes(search));
      }).map((r) => ({
        ...r,
        meaning: Array.isArray(r.meaning) ? r.meaning : [r.meaning].filter(Boolean),
      }));
      setItems(local);
    } finally {
      setLoading(false);
    }
  }, [q, aett]);

  React.useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-4">
      <Card title="Rune index">
        <div className="flex flex-wrap gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search (name, key, meaning...)"
            className="w-full flex-1 rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 md:w-auto"
          />
          <select
            value={aett}
            onChange={(e) => setAett(e.target.value)}
            className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2"
          >
            <option value="">All aetts</option>
            <option value="1">Aett 1</option>
            <option value="2">Aett 2</option>
            <option value="3">Aett 3</option>
          </select>
          <button onClick={load} className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 hover:bg-zinc-800">
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>
      </Card>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {items.map((r) => (
          <Card key={r.key} className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-zinc-400">Aett {r.aett}</div>
                <div className="text-lg font-semibold">{r.name}</div>
                <div className="text-sm text-zinc-300">{r.key} · {r.phonetic}</div>
              </div>
              <div className="text-5xl">{r.glyph}</div>
            </div>

            <div className="mt-3 text-sm text-zinc-200">
              <div className="font-medium text-zinc-100">Meaning</div>
              <div>{(r.meaning || []).join(", ")}</div>
            </div>

            {r.notes ? <div className="mt-2 text-sm text-zinc-400">{r.notes}</div> : null}
          </Card>
        ))}
      </div>
    </div>
  );
}
