import React from "react";
import { Card } from "../ui/components/Card.jsx";
import { api } from "../lib/api";

export function Lore() {
  const [items, setItems] = React.useState([]);
  const [status, setStatus] = React.useState(null);

  React.useEffect(() => {
    let mounted = true;
    api.get("/lore")
      .then((res) => mounted && setItems(res.data?.items || []))
      .catch(() => mounted && setStatus("Couldn't load lore from server."));
    return () => { mounted = false; };
  }, []);

  return (
    <div className="space-y-4">
      <Card title="Lore">
        <p className="text-zinc-300">
          Short lessons to keep you oriented. Keep it light, keep it consistent.
        </p>
      </Card>

      {status ? <Card title="Notice"><div className="text-zinc-300">{status}</div></Card> : null}

      <div className="grid gap-3 md:grid-cols-2">
        {items.map((x) => (
          <Card key={x.key} title={x.title}>
            <div className="text-zinc-300">{x.body}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
