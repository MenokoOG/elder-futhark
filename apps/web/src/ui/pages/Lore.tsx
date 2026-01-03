import React from "react";
import { Card } from "../../../../../packages/ui/src/components/Card";
import { useAuth } from "../../lib/auth";
import { api } from "../../lib/api";

export function LorePage() {
  const { token } = useAuth();
  const [data, setData] = React.useState<any | null>(null);

  async function load() {
    if (!token) return;
    const res = await api.get("/lore");
    setData(res.data);
  }

  React.useEffect(() => { void load(); }, [token]);

  if (!token) {
    return (
      <Card>
        <div className="text-xl font-bold">Lore Mode</div>
        <p className="mt-2 text-white/70">Sign in and score ≥ 8/10 on an Aett quiz to unlock its lore.</p>
      </Card>
    );
  }

  if (!data) return <div className="text-white/60">Loading…</div>;

  const unlocked = new Set<number>(data.unlockedAetts ?? []);

  return (
    <div className="grid gap-4">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight">Lore Mode</h2>
        <p className="text-sm text-white/60">
          Unlock rule: best quiz score ≥ 8/10 per Aett. Lessons are short, sharp, and systems-minded.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {data.lessons.map((l: any) => {
          const ok = unlocked.has(l.aett);
          return (
            <Card key={l.id} className={ok ? "" : "opacity-50"}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs text-white/60 font-mono">Aett {l.aett}</div>
                  <div className="mt-1 text-lg font-bold">{l.title}</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-1 text-xs font-mono">
                  {ok ? "unlocked" : "locked"}
                </div>
              </div>
              <p className="mt-2 text-sm text-white/75">{l.summary}</p>
              <ul className="mt-3 list-disc pl-5 text-sm text-white/75">
                {l.bullets.map((b: string) => <li key={b}>{b}</li>)}
              </ul>
            </Card>
          );
        })}
      </div>
    </div>
  );
}