import React from "react";
import { Card } from "../ui/components/Card.jsx";
import { api } from "../lib/api";

export function Progress() {
  const [p, setP] = React.useState(null);
  const [status, setStatus] = React.useState(null);

  React.useEffect(() => {
    let mounted = true;
    api.get("/progress/me")
      .then((res) => mounted && setP(res.data?.progress || null))
      .catch(() => mounted && setStatus("Couldn't load progress."));
    return () => { mounted = false; };
  }, []);

  return (
    <div className="space-y-4">
      <Card title="Progress">
        <div className="text-sm text-zinc-400">A lightweight profile of your learning path.</div>
      </Card>

      {status ? <Card title="Notice"><div className="text-zinc-300">{status}</div></Card> : null}

      <Card title="Snapshot">
        {!p ? (
          <div className="text-zinc-300">Loading…</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="text-sm text-zinc-400">Ritual streak</div>
              <div className="text-3xl font-semibold">{p.ritualStreak || 0}</div>
              <div className="mt-3 text-sm text-zinc-400">Total study reviews</div>
              <div className="text-3xl font-semibold">{p.totalStudyReviews || 0}</div>
            </div>
            <div>
              <div className="text-sm text-zinc-400">Unlocked lessons</div>
              <div className="text-zinc-300">{(p.unlockedLessonKeys || []).length}</div>
              <div className="mt-3 text-sm text-zinc-400">Achievements</div>
              <div className="text-zinc-300">{(p.unlockedAchievementKeys || []).length}</div>
              <div className="mt-3 text-sm text-zinc-400">Last ritual rune</div>
              <div className="text-zinc-300">{p.lastRuneKey || "—"}</div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
