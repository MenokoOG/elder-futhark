import React from "react";
import { Card } from "../ui/components/Card.jsx";
import { Button } from "../ui/components/Button.jsx";
import { ELDER_FUTHARK } from "../lib/elderFuthark";
import { choice, randBetween } from "../lib/math";

function drawStone(ctx, w, h, glyph) {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#070707";
  ctx.fillRect(0, 0, w, h);

  // stone
  ctx.save();
  ctx.translate(w / 2, h / 2);
  const rx = randBetween(120, 160);
  const ry = randBetween(140, 190);

  const grad = ctx.createRadialGradient(-40, -60, 40, 0, 0, Math.max(rx, ry));
  grad.addColorStop(0, "#2a2a2a");
  grad.addColorStop(1, "#0f0f0f");
  ctx.fillStyle = grad;

  ctx.beginPath();
  ctx.ellipse(0, 0, rx, ry, randBetween(-0.25, 0.25), 0, Math.PI * 2);
  ctx.fill();

  // rune carve
  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.font = "140px serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "rgba(255,255,255,0.35)";
  ctx.shadowBlur = 18;
  ctx.fillText(glyph, randBetween(-10, 10), randBetween(-10, 10));

  // chips
  ctx.shadowBlur = 0;
  ctx.strokeStyle = "rgba(255,255,255,0.10)";
  ctx.lineWidth = 2;
  for (let i = 0; i < 18; i++) {
    ctx.beginPath();
    ctx.moveTo(randBetween(-rx, rx), randBetween(-ry, ry));
    ctx.lineTo(randBetween(-rx, rx), randBetween(-ry, ry));
    ctx.stroke();
  }

  ctx.restore();
}

export function Stones() {
  const ref = React.useRef(null);
  const [rune, setRune] = React.useState(() => choice(ELDER_FUTHARK));
  const [size, setSize] = React.useState(420);

  const render = React.useCallback(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = size;
    canvas.height = size;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    drawStone(ctx, size, size, rune.glyph);
  }, [rune, size]);

  React.useEffect(() => { render(); }, [render]);

  return (
    <div className="space-y-4">
      <Card title="Rune stones generator">
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={() => setRune(choice(ELDER_FUTHARK))}>New stone</Button>
          <select
            value={rune.key}
            onChange={(e) => setRune(ELDER_FUTHARK.find(r => r.key === e.target.value))}
            className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2"
          >
            {ELDER_FUTHARK.map(r => <option key={r.key} value={r.key}>{r.name}</option>)}
          </select>
          <label className="text-sm text-zinc-300">
            Size{" "}
            <input type="range" min="280" max="640" value={size} onChange={(e) => setSize(Number(e.target.value))} className="ml-2 align-middle" />
            <span className="ml-2 text-zinc-400">{size}px</span>
          </label>
          <Button onClick={render}>Redraw</Button>
        </div>
      </Card>

      <Card title={`${rune.name} · ${rune.glyph}`}>
        <div className="flex items-center justify-center py-6">
          <canvas ref={ref} className="rounded-3xl border border-zinc-800"></canvas>
        </div>
        <div className="text-sm text-zinc-400">Procedural “stone” texture + rune carving vibe.</div>
      </Card>
    </div>
  );
}
