import React from "react";
import { Card } from "../ui/components/Card.jsx";
import { api } from "../lib/api";

export function Gods() {
  const [q, setQ] = React.useState("");
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [status, setStatus] = React.useState(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    setStatus(null);
    try {
      const params = {};
      if (q.trim()) params.q = q.trim();
      const res = await api.get("/lore/gods", { params });
      setItems(res.data?.items || []);
    } catch {
      setStatus("Couldn't load gods from server.");
    } finally {
      setLoading(false);
    }
  }, [q]);

  React.useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-4">
      <Card title="Gods & figures">
        <p className="text-zinc-300">
          Browse deities and beings referenced across lore and correspondences.
        </p>
      </Card>

      <Card>
        <div className="flex flex-wrap gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search gods, groups, domains..."
            className="w-full flex-1 rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 md:w-auto"
          />
          <button
            onClick={load}
            className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 hover:bg-zinc-800"
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>
      </Card>

      {status ? (
        <Card title="Notice">
          <div className="text-zinc-300">{status}</div>
        </Card>
      ) : null}

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {items.map((god) => (
          <Card key={god.key} title={god.name}>
            <div className="text-sm text-zinc-400">{god.group || "Other"}</div>

            {god.summary ? (
              <div className="mt-2 text-zinc-300">{god.summary}</div>
            ) : null}

            {Array.isArray(god.functions) && god.functions.length ? (
              <div className="mt-3 text-sm text-zinc-300">
                Functions:{" "}
                <span className="text-zinc-100">
                  {god.functions.join(", ")}
                </span>
              </div>
            ) : null}

            {Array.isArray(god.domains) && god.domains.length ? (
              <div className="mt-1 text-sm text-zinc-300">
                Domains:{" "}
                <span className="text-zinc-200">{god.domains.join(", ")}</span>
              </div>
            ) : null}
          </Card>
        ))}
      </div>
    </div>
  );
}
