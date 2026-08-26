import React from "react";
import { Card } from "../ui/components/Card.jsx";
import { api } from "../lib/api";

export function Stats() {
  const [s, setS] = React.useState(null);
  const [status, setStatus] = React.useState(null);

  React.useEffect(() => {
    let mounted = true;
    api.get("/stats/me")
      .then((res) => mounted && setS(res.data?.overview || null))
      .catch(() => mounted && setStatus("Couldn't load stats."));
    return () => { mounted = false; };
  }, []);

  return (
    <div className="space-y-4">
      <Card title="Stats">
        <div className="text-sm text-zinc-400">Numbers aren’t the point — momentum is.</div>
      </Card>

      {status ? <Card title="Notice"><div className="text-zinc-300">{status}</div></Card> : null}

      <div className="grid gap-3 md:grid-cols-3">
        <Card title="Study reviews">
          <div className="text-4xl font-semibold">{s?.totalStudyReviews ?? "—"}</div>
        </Card>
        <Card title="Ritual streak">
          <div className="text-4xl font-semibold">{s?.ritualStreak ?? "—"}</div>
        </Card>
        <Card title="Study items">
          <div className="text-4xl font-semibold">{s?.totalStudyItems ?? "—"}</div>
        </Card>
      </div>
    </div>
  );
}
