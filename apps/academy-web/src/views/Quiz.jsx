import React from "react";
import { ELDER_FUTHARK } from "../lib/elderFuthark";
import { choice } from "../lib/math";
import { Button } from "../ui/components/Button.jsx";
import { ScoreRing } from "../ui/components/graphics.jsx";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

function makeQuestion() {
  const r = choice(ELDER_FUTHARK);
  const type = choice(["glyph->name", "name->glyph", "meaning->key"]);
  const others = shuffle(ELDER_FUTHARK.filter((x) => x.key !== r.key)).slice(0, 3);
  if (type === "glyph->name")
    return { type, prompt: "Which rune is this?", glyph: r.glyph, answer: r.name, options: shuffle([r, ...others]).map((x) => x.name), rune: r, big: false };
  if (type === "name->glyph")
    return { type, prompt: `Which glyph matches ${r.name}?`, glyph: null, answer: r.glyph, options: shuffle([r, ...others]).map((x) => x.glyph), rune: r, big: true };
  const meaning = choice(r.meaning);
  return { type, prompt: `Which rune means "${meaning}"?`, glyph: null, answer: r.key, options: shuffle([r, ...others]).map((x) => x.key), rune: r, big: false };
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
    const count = Math.max(5, Math.min(30, Number(n) || 10));
    setQs(Array.from({ length: count }, makeQuestion));
    setI(0); setScore(0); setPicked(null); setDone(false);
  }, [n]);

  const choose = (opt) => {
    if (picked != null) return;
    setPicked(opt);
    if (opt === q.answer) setScore((s) => s + 1);
    setTimeout(() => {
      const next = i + 1;
      if (next >= qs.length) setDone(true);
      else { setI(next); setPicked(null); }
    }, 700);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-neutral-700">
          Questions
          <input type="number" min={5} max={30} value={n} onChange={(e) => setN(e.target.value)} className="input w-[84px]" />
        </label>
        <Button variant="primary" onClick={reset} className="whitespace-nowrap">New quiz</Button>
        <div className="flex-1" />
        <div className="flex items-center gap-3">
          <div className="h-2.5 w-[148px] overflow-hidden rounded-full bg-neutral-300">
            <div className="h-full rounded-full transition-all" style={{ background: "var(--pa)", width: `${qs.length ? (i / qs.length) * 100 : 0}%` }} />
          </div>
          <ScoreRing value={score} total={qs.length} />
          <span className="whitespace-nowrap text-[13.5px] text-neutral-700">{score} / {qs.length}</span>
        </div>
      </div>

      {done ? (
        <div className="card flex flex-col items-start gap-4 py-11" style={{ background: "var(--pt)" }}>
          <div className="text-[11.5px] uppercase tracking-[0.16em]" style={{ color: "var(--pd)" }}>Results</div>
          <div className="font-heading text-[56px] leading-none">{score} / {qs.length}</div>
          <p className="m-0 max-w-[44ch] leading-relaxed text-neutral-700">
            {score / qs.length >= 0.8 ? "That clears the bar. Move to the next aett." : "Keep going — decks and the study queue lift this fast."}
          </p>
          <Button variant="primary" onClick={reset}>Run it back</Button>
        </div>
      ) : (
        <div className="card flex flex-col gap-5 p-8">
          <div className="text-[11.5px] uppercase tracking-[0.16em] text-neutral-700">Question {i + 1} / {qs.length}</div>
          <div className="font-heading text-[30px] leading-tight" style={{ textWrap: "pretty" }}>{q.prompt}</div>
          {q.glyph ? (
            <div className="grid h-[146px] w-[146px] place-items-center rounded-full text-[88px] leading-none"
              style={{ background: "var(--pt)", color: "var(--pd)" }}>{q.glyph}</div>
          ) : null}
          <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))" }}>
            {q.options.map((opt) => {
              const answered = picked != null;
              const isAnswer = answered && opt === q.answer;
              const isWrong = answered && picked === opt && opt !== q.answer;
              return (
                <button key={opt} onClick={() => choose(opt)}
                  className={[
                    "rounded-md border px-5 py-4 text-left transition",
                    isAnswer ? "border-sage-600 bg-sage-200 text-sage-800" : isWrong ? "border-accent-600 bg-accent-200 text-accent-800" : "bg-neutral-100",
                  ].join(" ")}
                  style={!isAnswer && !isWrong ? { borderColor: "var(--color-divider)" } : undefined}>
                  <span className={q.big ? "text-[40px] leading-tight" : "text-[16.5px]"}>{opt}</span>
                </button>
              );
            })}
          </div>
          <div className="text-[13.5px] text-neutral-700">
            {picked != null ? `Answer · ${q.answer} · ${q.rune.glyph} ${q.rune.name}` : "Pick an answer."}
          </div>
        </div>
      )}
    </div>
  );
}
