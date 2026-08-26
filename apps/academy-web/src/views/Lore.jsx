import React from "react";
import { Card } from "../ui/components/Card.jsx";
import { api } from "../lib/api";

export function Lore() {
  const [items, setItems] = React.useState([]);
  const [gods, setGods] = React.useState([]);
  const [sources, setSources] = React.useState([]);
  const [status, setStatus] = React.useState(null);

  React.useEffect(() => {
    let mounted = true;
    api
      .get("/lore/bundle")
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
          setItems(fallback.data?.items || []);
          setGods([]);
          setSources([]);
        } catch {
          if (mounted) setStatus("Couldn't load lore from server.");
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-4">
      <Card title="Lore">
        <p className="text-zinc-300">
          Short lessons to keep you oriented. Keep it light, keep it consistent.
        </p>
      </Card>

      {status ? (
        <Card title="Notice">
          <div className="text-zinc-300">{status}</div>
        </Card>
      ) : null}

      <div className="grid gap-3 md:grid-cols-2">
        {items.map((x) => (
          <Card key={x.key} title={x.title}>
            <div className="text-zinc-300">{x.body}</div>
            {Array.isArray(x.tags) && x.tags.length ? (
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-zinc-400">
                {x.tags.map((tag) => (
                  <span
                    key={`${x.key}-${tag}`}
                    className="rounded-full border border-zinc-700 px-2 py-1"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            ) : null}
          </Card>
        ))}
      </div>

      {gods.length ? (
        <>
          <Card title="Gods & figures">
            <p className="text-zinc-300">
              Expanded context for deities and beings referenced in lore and
              correspondences.
            </p>
          </Card>

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {gods.map((god) => (
              <Card key={god.key} title={god.name}>
                <div className="text-sm text-zinc-400">{god.group}</div>
                {god.summary ? (
                  <div className="mt-2 text-zinc-300">{god.summary}</div>
                ) : null}
                {Array.isArray(god.domains) && god.domains.length ? (
                  <div className="mt-3 text-sm text-zinc-300">
                    Domains:{" "}
                    <span className="text-zinc-200">
                      {god.domains.join(", ")}
                    </span>
                  </div>
                ) : null}
              </Card>
            ))}
          </div>
        </>
      ) : null}

      {sources.length ? (
        <Card title="Sources">
          <div className="space-y-3 text-sm text-zinc-300">
            {sources.map((source) => (
              <div
                key={source.key}
                className="rounded-xl border border-zinc-800 p-3"
              >
                <div className="font-medium text-zinc-100">{source.title}</div>
                <div className="text-zinc-400">
                  {source.author} · {source.year}
                </div>
                {source.notes ? (
                  <div className="mt-1">{source.notes}</div>
                ) : null}
              </div>
            ))}
          </div>
        </Card>
      ) : null}
    </div>
  );
}
