import React from "react";
import { Card } from "../../ui/components/Card.jsx";
import { Button } from "../../ui/components/Button.jsx";
import { latinToRunes, runesToLatin } from "../../lib/transliteration";

export function Transliterate() {
  const [latin, setLatin] = React.useState("great application");
  const [runes, setRunes] = React.useState(() => latinToRunes("great application").runes);

  const toRunes = () => setRunes(latinToRunes(latin).runes);
  const toLatin = () => setLatin(runesToLatin(runes));

  return (
    <div className="space-y-4">
      <Card title="Transliteration lab">
        <p className="text-sm text-zinc-400">
          This is a learning tool, not a historical reconstruction. It keeps punctuation and spaces.
        </p>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Latin input">
          <textarea
            value={latin}
            onChange={(e) => setLatin(e.target.value)}
            rows={10}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3"
          />
          <div className="mt-3 flex gap-2">
            <Button onClick={toRunes}>→ To runes</Button>
          </div>
        </Card>

        <Card title="Rune output">
          <textarea
            value={runes}
            onChange={(e) => setRunes(e.target.value)}
            rows={10}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-2xl"
          />
          <div className="mt-3 flex gap-2">
            <Button onClick={toLatin}>→ To latin</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
