import React from "react";
import { api } from "../lib/api";
import { CenturyTimeline } from "../ui/components/graphics.jsx";

export function Lore() {
  const [items, setItems] = React.useState([]);
  const [gods, setGods] = React.useState([]);
  const [sources, setSources] = React.useState([]);
  const [status, setStatus] = React.useState(null);

  React.useEffect(() => {
    let mounted = true;
    api.get("/lore/bundle")
      .then((res) => {
        if (!mounted) return;
        setItems(res.data?.lessons || []);
        setGods(res.data?.gods || []);
        setSources(res.data?.sources || []);
      })
      .catch(async () => {
        try {
          const fallback = await api.get("/lore");
          if (!mounted) return;
          setItems(fallback.data?.items || []); setGods([]); setSources([]);
        } catch { if (mounted) setStatus("Couldn't load lore from server."); }
      });
    return () => { mounted = false; };
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <CenturyTimeline />

      {status ? <div className="card text-neutral-700">{status}</div> : null}

      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
        {items.map((x) => (
          <article key={x.key} className="card flex flex-col gap-2.5">
            <h3 className="m-0 text-[22px]">{x.title}</h3>
            <p className="m-0 leading-relaxed text-neutral-700" style={{ textWrap: "pretty" }}>{x.body}</p>
            {Array.isArray(x.tags) && x.tags.length ? (
              <div className="mt-1 flex flex-wrap gap-1.5">
                {x.tags.map((t) => <span key={t} className="tag tag-sage">{t}</span>)}
              </div>
            ) : null}
          </article>
        ))}
      </div>

      {gods.length ? (
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
          {gods.map((god) => (
            <article key={god.key} className="card flex flex-col gap-2.5">
              <div className="flex items-center justify-between gap-2.5">
                <h3 className="m-0 text-2xl">{god.name}</h3>
                <span className="tag tag-neutral">{god.group}</span>
              </div>
              {god.summary ? <p className="m-0 leading-normal text-neutral-700">{god.summary}</p> : null}
              {Array.isArray(god.domains) && god.domains.length ? (
                <div className="text-[13.5px] text-neutral-700">Domains · {god.domains.join(", ")}</div>
              ) : null}
            </article>
          ))}
        </div>
      ) : null}

      {sources.length ? (
        <section className="card" style={{ background: "#e1eecc" }}>
          <h2 className="mb-4 text-2xl">Sources</h2>
          <div className="flex flex-col gap-2.5">
            {sources.map((s) => (
              <div key={s.key} className="flex flex-wrap items-baseline gap-2.5 rounded-md bg-neutral-100 px-4 py-3">
                <span className="font-semibold">{s.title}</span>
                <span className="text-[13.5px] text-neutral-700">{s.author} · {s.year}</span>
                {s.notes ? <span className="text-[13.5px] text-neutral-700">{s.notes}</span> : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
