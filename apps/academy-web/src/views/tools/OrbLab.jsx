import React from "react";
import { RuneOrb } from "./RuneOrb.jsx";
import { ELDER_FUTHARK } from "../../lib/elderFuthark.js";
import { choice } from "../../lib/math.js";
import { Button } from "../../ui/components/Button.jsx";

export function OrbLab() {
  const [target, setTarget] = React.useState(() => choice(ELDER_FUTHARK));

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="primary" onClick={() => setTarget(choice(ELDER_FUTHARK))}>New target</Button>
        <span className="text-sm text-neutral-700">
          Focus rune <strong className="font-semibold">{target.name}</strong> <span className="text-neutral-700">({target.glyph})</span>
        </span>
        <div className="flex-1" />
        <span className="text-[12.5px] text-neutral-700">Drag to rotate · scroll to zoom</span>
      </div>

      <div className="h-[470px] overflow-hidden rounded-lg border"
        style={{ borderColor: "var(--color-divider)", background: "radial-gradient(circle at 32% 24%, #eee7db, #ebddc5 68%)" }}>
        <RuneOrb glyph={target.glyph} />
      </div>
    </div>
  );
}
