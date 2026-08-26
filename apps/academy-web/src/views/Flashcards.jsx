import React from "react";
import { Card } from "../ui/components/Card.jsx";
import { Button } from "../ui/components/Button.jsx";
import { ELDER_FUTHARK } from "../lib/elderFuthark";
import { choice } from "../lib/math";
import { useAuth } from "../state/auth.jsx";
import { api } from "../lib/api";

function deckFor(aett) {
  if (!aett) return ELDER_FUTHARK;
  return ELDER_FUTHARK.filter(r => r.aett === Number(aett));
}

export function Flashcards() {
  const { token } = useAuth();
  const [aett, setAett] = React.useState("");
  const [side, setSide] = React.useState("front"); // front shows glyph
  const [card, setCard] = React.useState(() => choice(ELDER_FUTHARK));
  const [message, setMessage] = React.useState(null);

  const next = React.useCallback(() => {
    setSide("front");
    setMessage(null);
    setCard(choice(deckFor(aett)));
  }, [aett]);

  const rate = React.useCallback(async (quality) => {
    if (!token) {
      setMessage("Sign in to save spaced-repetition reviews.");
      return;
    }
    try {
      await api.post("/study/rate", { runeKey: card.key, quality });
      setMessage("Saved ✅");
      setTimeout(() => next(), 350);
    } catch {
      setMessage("Couldn't save review (server).");
    }
  }, [token, card?.key, next]);

  return (
    <div className="space-y-4">
      <Card title="Decks">
        <div className="flex flex-wrap items-center gap-2">
          <select value={aett} onChange={(e) => setAett(e.target.value)} className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2">
            <option value="">All aetts</option>
            <option value="1">Aett 1</option>
            <option value="2">Aett 2</option>
            <option value="3">Aett 3</option>
          </select>
          <Button onClick={next}>New card</Button>
          <Button onClick={() => setSide(s => (s === "front" ? "back" : "front"))}>
            Flip
          </Button>
          {message ? <span className="text-sm text-zinc-300">{message}</span> : null}
        </div>
      </Card>

      <Card title="Flashcard">
        <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
          {side === "front" ? (
            <>
              <div className="text-8xl">{card.glyph}</div>
              <div className="text-sm text-zinc-400">Flip to reveal</div>
            </>
          ) : (
            <>
              <div className="text-2xl font-semibold">{card.name}</div>
              <div className="text-zinc-300">{card.key} · {card.phonetic}</div>
              <div className="text-zinc-200">Meaning: {(card.meaning || []).join(", ")}</div>
              <div className="max-w-xl text-sm text-zinc-400">{card.notes}</div>
            </>
          )}

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {[0,1,2,3,4,5].map(q => (
              <Button key={q} onClick={() => rate(q)} className="text-sm">
                {q}
              </Button>
            ))}
          </div>
          <div className="text-xs text-zinc-500">Rate recall: 0 (blank) → 5 (perfect). Saves to your Study queue.</div>
        </div>
      </Card>
    </div>
  );
}
