import React from "react";
import { Card } from "@efa/ui";
import { useAuth } from "../../lib/auth";
import { api } from "../../lib/api";

export function ProgressPage() {
  const { token } = useAuth();
  const [data, setData] = React.useState<any | null>(null);

  async function load() {
    if (!token) return;
    const res = await api.get("/progress");
    setData(res.data);
  }

  React.useEffect(() => { void load(); }, [token]);

  if (!token) {
    return (
      <Card>
        <div className="text-xl font-bold">Progress</div>
        <p className="mt-2 text-white/70">Sign in to see streaks, achievements, and best quiz scores.</p>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight">Progress & Achievements</h2>
        <p className="text-sm text-white/60">This is the “show the engineering” dashboard.</p>
      </div>

      {!data ? (
        <div className="text-white/60">Loading…</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <div className="text-xs text-white/60 font-mono">streak</div>
            <div className="mt-2 text-3xl font-extrabold">{data.streak}</div>
          </Card>
          <Card>
            <div className="text-xs text-white/60 font-mono">total SM-2 reviews</div>
            <div className="mt-2 text-3xl font-extrabold">{data.totalStudyReviews}</div>
          </Card>
          <Card>
            <div className="text-xs text-white/60 font-mono">best quiz by aett</div>
            <div className="mt-2 text-sm text-white/80 font-mono">
              A1: {data.bestQuizByAett?.["1"] ?? 0}/10<br />
              A2: {data.bestQuizByAett?.["2"] ?? 0}/10<br />
              A3: {data.bestQuizByAett?.["3"] ?? 0}/10
            </div>
          </Card>

          <Card className="md:col-span-3">
            <div className="text-xs text-white/60 font-mono">achievements</div>
            {data.achievements?.length ? (
              <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {data.achievements.map((a: any) => (
                  <div key={a.key} className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <div className="font-bold">{a.key}</div>
                    <div className="text-xs text-white/60 font-mono">{new Date(a.unlockedAt).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-2 text-white/60">No achievements yet. Start ritual + study + quiz.</div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}