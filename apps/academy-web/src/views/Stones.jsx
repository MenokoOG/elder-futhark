import React from "react";
import { ELDER_FUTHARK } from "../lib/elderFuthark";
import { choice, randBetween } from "../lib/math";
import { Button } from "../ui/components/Button.jsx";

/** Warm stone on the Organic ground: sand field, neutral-ramp stone, carved highlight. */
function drawStone(ctx, size, glyph) {
  const rand = randBetween;
  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = "#eee7db";
  ctx.fillRect(0, 0, size, size);

  ctx.save();
  ctx.translate(size / 2, size / 2);
  const rx = size * rand(0.28, 0.37);
  const ry = size * rand(0.33, 0.44);

  const grad = ctx.createRadialGradient(-rx * 0.3, -ry * 0.4, rx * 0.2, 0, 0, Math.max(rx, ry));
  grad.addColorStop(0, "#c0b6a5");
  grad.addColorStop(1, "#645c50");
  ctx.shadowColor = "rgba(46,43,37,0.28)";
  ctx.shadowBlur = 26;
  ctx.shadowOffsetY = 10;
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.ellipse(0, 0, rx, ry, rand(-0.22, 0.22), 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  ctx.save();
  ctx.beginPath();
  ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
  ctx.clip();
  ctx.strokeStyle = "rgba(64,35,16,0.10)";
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 22; i++) {
    ctx.beginPath();
    ctx.moveTo(rand(-rx, rx), rand(-ry, ry));
    ctx.lineTo(rand(-rx, rx), rand(-ry, ry));
    ctx.stroke();
  }
  ctx.restore();

  ctx.font = `${Math.round(size * 0.33)}px serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "rgba(46,43,37,0.55)";
  ctx.fillText(glyph, rand(-6, 6) + 2, rand(-6, 6) + 3);
  ctx.fillStyle = "#f9f4ed";
  ctx.fillText(glyph, rand(-6, 6), rand(-6, 6));
  ctx.restore();
}

export function Stones() {
  const ref = React.useRef(null);
  const [rune, setRune] = React.useState(() => choice(ELDER_FUTHARK));
  const [size, setSize] = React.useState(420);
  const [seed, setSeed] = React.useState(0);

  const render = React.useCallback(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawStone(ctx, size, rune.glyph);
  }, [rune, size, seed]);

  React.useEffect(() => { render(); }, [render]);

  return (
    <div className="grid items-start gap-6 min-[900px]:grid-cols-[minmax(0,1fr)_268px]">
      <div className="card flex flex-col gap-4">
        <div className="flex items-baseline gap-2.5">
          <span className="font-heading text-2xl">{rune.name}</span>
          <span className="text-[22px] text-neutral-700">{rune.glyph}</span>
        </div>
        <div className="flex justify-center rounded-lg bg-neutral-200 p-6">
          <canvas ref={ref} className="max-w-full rounded-lg" />
        </div>
        <div className="text-[13.5px] text-neutral-700">Procedural stone and carved rune. Every draw is a different stone.</div>
      </div>

      <aside className="card flex flex-col gap-4" style={{ background: "#eee7db" }}>
        <label className="flex flex-col gap-1.5 text-[13px] uppercase tracking-[0.1em] text-neutral-700">
          Rune
          <select value={rune.key} onChange={(e) => setRune(ELDER_FUTHARK.find((r) => r.key === e.target.value))}
            className="input text-[14.5px] normal-case tracking-normal">
            {ELDER_FUTHARK.map((r) => <option key={r.key} value={r.key}>{r.name} · {r.glyph}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1.5 whitespace-nowrap text-[13px] uppercase tracking-[0.1em] text-neutral-700">
          Size {size}px
          <input type="range" min="280" max="620" value={size} onChange={(e) => setSize(Number(e.target.value))} style={{ accentColor: "var(--pa)" }} />
        </label>
        <Button variant="primary" block onClick={() => { setRune(choice(ELDER_FUTHARK)); setSeed((s) => s + 1); }}>Cast a new stone</Button>
        <Button block onClick={() => setSeed((s) => s + 1)}>Redraw</Button>
      </aside>
    </div>
  );
}
