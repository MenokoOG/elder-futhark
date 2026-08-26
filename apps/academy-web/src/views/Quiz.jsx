import React from "react";
import { Card } from "../ui/components/Card.jsx";
import { Button } from "../ui/components/Button.jsx";
import { ELDER_FUTHARK } from "../lib/elderFuthark";
import { choice } from "../lib/math";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeQuestion() {
  const r = choice(ELDER_FUTHARK);
  const type = choice(["glyph->name", "name->glyph", "meaning->key"]);

  if (type === "glyph->name") {
    const opts = shuffle([r, ...shuffle(ELDER_FUTHARK.filter(x => x.key !== r.key)).slice(0,3)]).map(x => x.name);
    return { type, prompt: `Which rune is this? ${r.glyph}`, answer: r.name, options: opts, rune: r };
  }
  if (type === "name->glyph") {
    const opts = shuffle([r, ...shuffle(ELDER_FUTHARK.filter(x => x.key !== r.key)).slice(0,3)]).map(x => x.glyph);
    return { type, prompt: `Which glyph matches ${r.name}?`, answer: r.glyph, options: opts, rune: r };
  }
  // meaning->key
  const meaning = choice(r.meaning);
  const opts = shuffle([r, ...shuffle(ELDER_FUTHARK.filter(x => x.key !== r.key)).slice(0,3)]).map(x => x.key);
  return { type, prompt: `Which rune matches meaning: "${meaning}"?`, answer: r.key, options: opts, rune: r };
}

export function Quiz() {
  const [n, setN] = React.useState(10);
  const [qs, setQs] = React.useState(() => Array.from({ length: 10 }, makeQuestion));
  const [i, setI] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [picked, setPicked] = React.useState(null);
  const [done, setDone] = React.useState(false);

  const q = qs[i];

  const reset = React.useCallback(() => {
    const count = Number(n) || 10;
    setQs(Array.from({ length: count }, makeQuestion));
    setI(0);
    setScore(0);
    setPicked(null);
    setDone(false);
  }, [n]);

  const choose = (opt) => {
    if (picked != null) return;
    setPicked(opt);
    const correct = opt === q.answer;
    if (correct) setScore(s => s + 1);
    setTimeout(() => {
      const next = i + 1;
      if (next >= qs.length) {
        setDone(true);
      } else {
        setI(next);
        setPicked(null);
      }
    }, 650);
  };

  return (
    <div className="space-y-4">
      <Card title="Quiz">
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-sm text-zinc-300">
            Questions{" "}
            <input
              type="number"
              min={5}
              max={30}
              value={n}
              onChange={(e) => setN(e.target.value)}
              className="ml-2 w-20 rounded-lg border border-zinc-700 bg-zinc-950 px-2 py-1"
            />
          </label>
          <Button onClick={reset}>New quiz</Button>
          <div className="text-sm text-zinc-300">Score: {score}/{qs.length}</div>
        </div>
      </Card>

      {done ? (
        <Card title="Results">
          <div className="text-xl font-semibold">You scored {score}/{qs.length}</div>
          <div className="mt-2 text-zinc-300">
            {score / qs.length >= 0.8 ? "Nice. You're ready to move forward." : "Keep grinding. Decks + Study will raise this fast."}
          </div>
          <div className="mt-4"><Button onClick={reset}>Run it back</Button></div>
        </Card>
      ) : (
        <Card title={`Question ${i + 1} / ${qs.length}`}>
          <div className="text-lg font-medium">{q.prompt}</div>

          <div className="mt-4 grid gap-2 md:grid-cols-2">
            {q.options.map((opt) => {
              const isPicked = picked === opt;
              const isCorrect = picked != null && opt === q.answer;
              const isWrongPick = isPicked && opt !== q.answer;

              return (
                <button
                  key={opt}
                  onClick={() => choose(opt)}
                  className={[
                    "rounded-xl border px-4 py-3 text-left transition",
                    "border-zinc-800 bg-zinc-900/40 hover:bg-zinc-800/60",
                    isCorrect ? "border-green-700 bg-green-950/40" : "",
                    isWrongPick ? "border-red-700 bg-red-950/40" : ""
                  ].join(" ")}
                >
                  <div className="font-medium">{opt}</div>
                </button>
              );
            })}
          </div>

          {picked != null ? (
            <div className="mt-4 text-sm text-zinc-300">
              Answer: <span className="text-zinc-100">{q.answer}</span> · Rune: <span className="text-zinc-100">{q.rune.glyph}</span>
            </div>
          ) : (
            <div className="mt-4 text-sm text-zinc-500">Pick an answer.</div>
          )}
        </Card>
      )}
    </div>
  );
}
