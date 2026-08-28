import React from "react";
import { api } from "../lib/api";
import { GodClusters } from "../ui/components/graphics.jsx";

export function Gods() {
  const [q, setQ] = React.useState("");
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [status, setStatus] = React.useState(null);

  const load = React.useCallback(async () => {
    setLoading(true); setStatus(null);
    try {
      const params = {};
      if (q.trim()) params.q = q.trim();
      const res = await api.get("/lore/gods", { params });
      setItems(res.data?.items || []);
    } catch { setStatus("Couldn't load gods from server."); }
    finally { setLoading(false); }
  }, [q]);

  React.useEffect(() => { load(); }, [load]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search names, groups, domains" className="input min-w-[240px] flex-1" />
        <span className="text-[13px] text-neutral-700">{loading ? "Loading…" : `${items.length} named`}</span>
      </div>

      {status ? <div className="card text-neutral-700">{status}</div> : <GodClusters items={items} />}

      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
        {items.map((god) => (
          <article key={god.key} className="card flex flex-col gap-2.5">
            <div className="flex items-center justify-between gap-2.5">
              <h3 className="m-0 text-2xl">{god.name}</h3>
              <span className="tag tag-neutral">{god.group || "Other"}</span>
            </div>
            {god.summary ? <p className="m-0 leading-normal text-neutral-700" style={{ textWrap: "pretty" }}>{god.summary}</p> : null}
            {Array.isArray(god.functions) && god.functions.length ? (
              <div className="text-[13.5px] text-neutral-700">Functions · {god.functions.join(", ")}</div>
            ) : null}
            {Array.isArray(god.domains) && god.domains.length ? (
              <div className="text-[13.5px] text-neutral-700">Domains · {god.domains.join(", ")}</div>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}
