import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { RuneSchema } from "@efa/shared";
import { z } from "zod";
import { Card, Button } from "@efa/ui";
import { motion } from "framer-motion";

const RuneArraySchema = z.array(RuneSchema);

type Mark = "again" | "known";
type DeckState = Record<string, { again: number; known: number }>;

const STORAGE_KEY = "efa_flashcards_state_v1";

function loadState(): DeckState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as DeckState) : {};
  } catch {
    return {};
  }
}

function saveState(state: DeckState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function Flashcards() {
  const { data } = useQuery({
    queryKey: ["runes_all"],
    queryFn: async () => {
      const res = await api.get("/runes");
      return RuneArraySchema.parse(res.data);
    }
  });

  const [state, setState] = React.useState<DeckState>(() => loadState());
  const [idx, setIdx] = React.useState(0);
  const [reveal, setReveal] = React.useState(false);

  React.useEffect(() => saveState(state), [state]);

  const runes = data ?? [];
  const current = runes[idx % Math.max(1, runes.length)];

  function mark(m: Mark) {
    if (!current) return;
    setState((prev) => {
      const next = { ...prev };
      const cur = next[current.key] ?? { again: 0, known: 0 };
      cur[m] += 1;
      next[current.key] = cur;
      return next;
    });
    setReveal(false);
    setIdx((x) => x + 1);
  }

  if (!current) return <div className="text-white/60">Loading deck…</div>;

  const stats = state[current.key] ?? { again: 0, known: 0 };

  return (
    <div className="grid gap-4">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight">Flashcards</h2>
        <p className="text-sm text-white/60">Tap to reveal. Mark “Again” or “Known”.</p>
      </div>

      <motion.div
        key={current.key}
        initial={{ opacity: 0, y: 10, rotate: -0.4 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 0.25 }}
      >
        <Card className="cursor-pointer select-none" onClick={() => setReveal((r) => !r)}>
          <div className="flex items-start justify-between">
            <div className="text-7xl rune-glow">{current.glyph}</div>
            <div className="text-xs font-mono text-white/60">
              known:{stats.known} • again:{stats.again}
            </div>
          </div>

          <div className="mt-4">
            <div className="text-lg font-bold">{current.name}</div>
            <div className="text-xs text-white/60 font-mono">phonetic: {current.phonetic} • aett {current.aett}</div>
          </div>

          <div className="mt-4">
            {!reveal ? (
              <div className="text-white/60">Click to reveal meaning…</div>
            ) : (
              <>
                <div className="flex flex-wrap gap-2">
                  {current.meaning.map((m) => (
                    <span key={m} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs">
                      {m}
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-sm text-white/75">{current.notes}</p>
              </>
            )}
          </div>
        </Card>
      </motion.div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={() => mark("again")} className="bg-white text-black hover:bg-zinc-200">
          Again
        </Button>
        <Button variant="ghost" onClick={() => mark("known")}>
          Known
        </Button>
        <Button variant="ghost" onClick={() => { setReveal(false); setIdx((x) => x + 1); }}>
          Skip
        </Button>
      </div>
    </div>
  );
}