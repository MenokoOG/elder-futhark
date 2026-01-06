import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, Button } from "@efa/ui";
import { api } from "../../lib/api";
import { useAuth } from "../../lib/auth";

type StatsResponse = {
  userId?: string;
  streakDays?: number;
  totalStudyReviews?: number;
  achievementsUnlocked?: number;
  lastRitualDate?: string | null;
  bestQuizByAett?: Record<string, number>;
};

function fmtDate(iso?: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}

export function StatsPage() {
  const { token } = useAuth();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["stats"],
    enabled: !!token,
    queryFn: async () => {
      // Server should expose GET /stats (or we’ll add it next on backend)
      const res = await api.get<StatsResponse>("/stats");
      return res.data;
    }
  });

  if (!token) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h2 className="text-2xl font-extrabold tracking-tight">Stats</h2>
        <p className="mt-2 text-white/60">
          Sign in first so we can load your progress (streaks, reviews, achievements).
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">Stats</h2>
          <p className="text-sm text-white/60">
            Quick readout of your progression signals. (We’ll make this 🔥 once backend stats is finalized.)
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => refetch()}>Refresh</Button>
        </div>
      </div>

      {isLoading && <div className="text-white/60">Loading…</div>}
      {error && (
        <Card>
          <div className="text-red-200 font-semibold">Stats endpoint not ready yet.</div>
          <div className="mt-2 text-sm text-white/60">
            Your frontend is calling <span className="font-mono">GET /api/stats</span>. If the API returns 404,
            we need to add <span className="font-mono">StatsController</span> route on Nest.
          </div>
        </Card>
      )}

      {data && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <div className="text-xs font-mono text-white/60">overview</div>
            <div className="mt-3 grid gap-2 text-sm">
              <div className="flex items-center justify-between">
                <div className="text-white/60">User</div>
                <div className="font-mono">{data.userId || "—"}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-white/60">Streak days</div>
                <div className="font-mono">{data.streakDays ?? "—"}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-white/60">Total reviews</div>
                <div className="font-mono">{data.totalStudyReviews ?? "—"}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-white/60">Achievements</div>
                <div className="font-mono">{data.achievementsUnlocked ?? "—"}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-white/60">Last ritual</div>
                <div className="font-mono">{fmtDate(data.lastRitualDate)}</div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="text-xs font-mono text-white/60">best quiz by aett</div>
            <div className="mt-3 grid gap-2 text-sm">
              {data.bestQuizByAett ? (
                ["1", "2", "3"].map((k) => (
                  <div key={k} className="flex items-center justify-between">
                    <div className="text-white/60">Aett {k}</div>
                    <div className="font-mono">{data.bestQuizByAett?.[k] ?? 0}/10</div>
                  </div>
                ))
              ) : (
                <div className="text-white/60">—</div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}