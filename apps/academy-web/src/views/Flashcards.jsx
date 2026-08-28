import React from "react";
import { AETTS as AETT_META } from "@efa/futhark-aetts";
import { ELDER_FUTHARK } from "../lib/elderFuthark";
import { choice } from "../lib/math";
import { useAuth } from "../state/auth.jsx";
import { api } from "../lib/api";
import { Button } from "../ui/components/Button.jsx";

// Deck labels come from the canonical aett module, not hardcoded numbers.
const AETTS = [["", "All aetts"], ...AETT_META.map((a) => [String(a.number), a.name])];
const deckFor = (aett) => (aett ? ELDER_FUTHARK.filter((r) => r.aett === Number(aett)) : ELDER_FUTHARK);

export function Flashcards() {
  const { token } = useAuth();
  const [aett, setAett] = React.useState("");
  const [side, setSide] = React.useState("front");
  const [card, setCard] = React.useState(() => choice(ELDER_FUTHARK));
  const [message, setMessage] = React.useState(null);

  const next = React.useCallback(() => {
    setSide("front"); setMessage(null); setCard(choice(deckFor(aett)));
  }, [aett]);

  const rate = React.useCallback(async (quality) => {
    if (!token) { setMessage("Sign in to save spaced-repetition reviews."); return; }
    try {
      await api.post("/study/rate", { runeKey: card.key, quality });
      setMessage("Saved");
      setTimeout(next, 350);
    } catch {
      setMessage("Couldn't save review (server).");
    }
  }, [token, card?.key, next]);

  return (
    <div className="grid items-start gap-6 min-[900px]:grid-cols-[minmax(0,1fr)_288px]">
      <div className="card flex flex-col items-center gap-5 py-11 shadow-md">
        <button onClick={() => setSide((s) => (s === "front" ? "back" : "front"))}
          className="flex min-h-[320px] w-full max-w-[430px] flex-col items-center justify-center gap-3 rounded-lg border p-8 text-center shadow-sm hover:shadow-md"
          style={{ background: "var(--pt)", borderColor: "#ccdbb2" }}>
          {side === "front" ? (
            <div className="flex flex-col items-center gap-4">
              <div className="text-[132px] leading-none" style={{ color: "var(--pd)" }}>{card.glyph}</div>
              <div className="text-[12.5px] uppercase tracking-[0.14em] text-neutral-700">Tap to reveal</div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="font-heading text-[34px]">{card.name}</div>
              <div className="text-[15px] text-neutral-700">{card.phonetic} · {card.key}</div>
              <div className="mt-2 text-[17px]">{(card.meaning || []).join(", ")}</div>
              <div className="max-w-[34ch] text-sm leading-normal text-neutral-700">{card.notes}</div>
            </div>
          )}
        </button>

        <div className="flex flex-col items-center gap-2.5">
          <div className="text-[12.5px] uppercase tracking-[0.12em] text-neutral-700">Rate your recall</div>
          <div className="flex flex-wrap justify-center gap-2">
            {[0, 1, 2, 3, 4, 5].map((q) => (
              <button key={q} onClick={() => rate(q)}
                className="h-[46px] w-[46px] rounded-full border border-sage-300 bg-neutral-100 text-base text-sage-800 hover:bg-sage-200">{q}</button>
            ))}
          </div>
          <div className="text-[12.5px] text-neutral-700">0 blank → 5 perfect. Saves into your study queue.</div>
          {message ? <div className="text-[13.5px]" style={{ color: "var(--pd)" }}>{message}</div> : null}
        </div>
      </div>

      <aside className="card flex flex-col gap-4" style={{ background: "#f0fae1" }}>
        <div>
          <div className="mb-2 text-[10.5px] uppercase tracking-[0.14em] text-neutral-700">Deck</div>
          <div className="flex flex-col gap-1.5">
            {AETTS.map(([value, label]) => (
              <button key={label} onClick={() => { setAett(value); setSide("front"); setCard(choice(deckFor(value))); }}
                className={`flex items-center justify-between rounded-full border px-4 py-2 text-left text-sm ${aett === value ? "bg-neutral-100 font-semibold" : ""}`}
                style={{ borderColor: "var(--color-divider)" }}>
                <span>{label}</span>
                <span className="text-[12.5px] opacity-70">{deckFor(value).length}</span>
              </button>
            ))}
          </div>
        </div>
        <Button variant="primary" block onClick={next}>New card</Button>
        <Button block onClick={() => setSide((s) => (s === "front" ? "back" : "front"))}>Flip</Button>
      </aside>
    </div>
  );
}
