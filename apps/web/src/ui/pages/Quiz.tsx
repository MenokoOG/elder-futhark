import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { RuneSchema } from "@efa/shared";
import { z } from "zod";
import { Card, Button } from "@efa/ui";

const RuneArraySchema = z.array(RuneSchema);

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function Quiz() {
  const { data } = useQuery({
    queryKey: ["runes_quiz"],
    queryFn: async () => {
      const res = await api.get("/runes");
      return RuneArraySchema.parse(res.data);
    }
  });

  const runes = data ?? [];
  const [score, setScore] = React.useState(0);
  const [round, setRound] = React.useState(0);
  const [picked, setPicked] = React.useState<string | null>(null);
  const [done, setDone] = React.useState(false);

  const current = React.useMemo(() => {
    if (runes.length < 4) return null;
    const target = runes[Math.floor(Math.random() * runes.length)];
    const distractors = shuffle(runes.filter((r) => r.key !== target.key)).slice(0, 3);
    const options = shuffle([target, ...distractors]).map((r) => ({
      key: r.key,
      label: r.meaning[0] ?? r.name
    }));
    return { target, options };
  }, [runes, round]);

  function choose(key: string) {
    if (!current || done) return;
    setPicked(key);
    const correct = key === current.target.key;
    if (correct) setScore((s) => s + 1);

    window.setTimeout(() => {
      setPicked(null);
      setRound((r) => r + 1);
      if (round + 1 >= 10) setDone(true);
    }, 500);
  }

  function reset() {
    setScore(0);
    setRound(0);
    setPicked(null);
    setDone(false);
  }

  if (!current) return <div className="text-white/60">Loading quiz…</div>;

  return (
    <div className="grid gap-4">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">Quiz</h2>
          <p className="text-sm text-white/60">Pick the best meaning keyword. 10 rounds.</p>
        </div>
        <div className="text-sm font-mono text-white/70">
          round {Math.min(round + 1, 10)}/10 • score {score}
        </div>
      </div>

      <Card>
        <div className="text-center">
          <div className="text-7xl rune-glow">{current.target.glyph}</div>
          <div className="mt-2 text-lg font-bold">{current.target.name}</div>
          <div className="text-xs text-white/60 font-mono">phonetic: {current.target.phonetic}</div>
        </div>

        <div className="mt-6 grid gap-2">
          {current.options.map((o) => {
            const isCorrect = picked && o.key === current.target.key;
            const isWrongPick = picked === o.key && o.key !== current.target.key;
            return (
              <button
                key={o.key}
                onClick={() => choose(o.key)}
                disabled={!!picked || done}
                className={[
                  "rounded-xl border px-4 py-3 text-left text-sm font-semibold transition",
                  "border-white/10 bg-white/5 hover:bg-white/10",
                  isCorrect ? "border-green-400/40 bg-green-400/10" : "",
                  isWrongPick ? "border-red-400/40 bg-red-400/10" : ""
                ].join(" ")}
              >
                {o.label}
              </button>
            );
          })}
        </div>

        {done && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-white/70">
              Final score: <span className="font-bold text-white">{score}/10</span>
            </div>
            <Button onClick={reset}>Run Again</Button>
          </div>
        )}
      </Card>
    </div>
  );
}