import React from "react";
import { latinToRunes, runesToLatin } from "../../lib/transliteration";
import { Button } from "../../ui/components/Button.jsx";
import { MappingRibbon } from "../../ui/components/graphics.jsx";

export function Transliterate() {
  const [latin, setLatin] = React.useState("great application");
  const [runes, setRunes] = React.useState(() => latinToRunes("great application").runes);

  const toRunes = () => setRunes(latinToRunes(latin).runes);
  const toLatin = () => setLatin(runesToLatin(runes));

  return (
    <div className="flex flex-col gap-5">
      <div className="grid items-start gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
        <section className="card flex flex-col gap-3">
          <div className="text-[10.5px] uppercase tracking-[0.14em] text-neutral-700">Latin in</div>
          <textarea value={latin} onChange={(e) => setLatin(e.target.value)} rows={9} className="input resize-y leading-relaxed" />
          <Button variant="primary" onClick={toRunes}>To runes</Button>
        </section>

        <section className="card flex flex-col gap-3" style={{ background: "var(--pt)" }}>
          <div className="text-[10.5px] uppercase tracking-[0.14em]" style={{ color: "var(--pd)" }}>Runes out</div>
          <textarea value={runes} onChange={(e) => setRunes(e.target.value)} rows={9}
            className="input resize-y text-[26px] leading-relaxed tracking-wide" />
          <Button onClick={toLatin}>To latin</Button>
        </section>
      </div>

      <MappingRibbon map={latinToRunes(latin).map} />

      <p className="m-0 max-w-[62ch] text-[13.5px] leading-relaxed text-neutral-700">
        A learning tool, not a historical reconstruction. Digraphs TH, NG and EI map to single runes; punctuation and spacing pass through untouched.
      </p>
    </div>
  );
}
