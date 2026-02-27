import React from "react";
import { Card } from "../../ui/components/Card.jsx";
import { Button } from "../../ui/components/Button.jsx";
import { RuneOrb } from "./RuneOrb.jsx";
import { ELDER_FUTHARK } from "../../lib/elderFuthark.js";
import { choice } from "../../lib/math.js";

export function OrbLab() {
  const [target, setTarget] = React.useState(() => choice(ELDER_FUTHARK));

  return (
    <div className="space-y-4">
      <Card title="Rune orb">
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={() => setTarget(choice(ELDER_FUTHARK))}>
            New target
          </Button>
          <div className="text-sm text-zinc-300">
            Focus rune: <span className="text-zinc-100">{target.name}</span>{" "}
            <span className="text-zinc-500">({target.glyph})</span>
          </div>
        </div>
      </Card>

      <Card title="3D Orb">
        <div className="h-[460px] rounded-2xl border border-zinc-800 bg-zinc-950">
          <RuneOrb glyph={target.glyph} />
        </div>
        <div className="mt-3 text-sm text-zinc-400">
          Drag to rotate. Scroll to zoom.
        </div>
      </Card>
    </div>
  );
}
