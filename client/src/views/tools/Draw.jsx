import React from "react";
import { Card } from "../../ui/components/Card.jsx";
import { Button } from "../../ui/components/Button.jsx";
import { RuneOrb } from "./RuneOrb.jsx";
import { ELDER_FUTHARK } from "../../lib/elderFuthark";
import { choice } from "../../lib/math";

function useCanvasDraw() {
  const ref = React.useRef(null);
  const [brush, setBrush] = React.useState(8);
  const [ink, setInk] = React.useState("#ffffff");

  React.useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      const parent = canvas.parentElement;
      const w = Math.min(parent.clientWidth, 900);
      const h = 420;
      canvas.width = Math.floor(w * window.devicePixelRatio);
      canvas.height = Math.floor(h * window.devicePixelRatio);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, w, h);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  React.useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = ink;
    ctx.lineWidth = brush;
  }, [brush, ink]);

  React.useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let drawing = false;
    let last = null;

    const pos = (e) => {
      const r = canvas.getBoundingClientRect();
      const x = (e.clientX - r.left);
      const y = (e.clientY - r.top);
      return { x, y };
    };

    const down = (e) => {
      drawing = true;
      last = pos(e);
    };
    const move = (e) => {
      if (!drawing) return;
      const p = pos(e);
      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      last = p;
    };
    const up = () => { drawing = false; last = null; };

    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);

    return () => {
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, []);

  const clear = React.useCallback(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, w, h);
  }, []);

  return { ref, brush, setBrush, ink, setInk, clear };
}

export function Draw() {
  const [mode, setMode] = React.useState("canvas"); // canvas | orb
  const [target, setTarget] = React.useState(() => choice(ELDER_FUTHARK));
  const { ref, brush, setBrush, ink, setInk, clear } = useCanvasDraw();

  return (
    <div className="space-y-4">
      <Card title="Rune drawing lab">
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={() => setTarget(choice(ELDER_FUTHARK))}>New target</Button>
          <div className="text-sm text-zinc-300">
            Target: <span className="text-zinc-100">{target.name}</span> <span className="text-zinc-500">({target.glyph})</span>
          </div>

          <div className="ml-auto flex flex-wrap items-center gap-2">
            <button
              onClick={() => setMode("canvas")}
              className={`rounded-xl px-3 py-2 text-sm ${mode==="canvas" ? "bg-zinc-800" : "bg-zinc-900/40"} border border-zinc-800`}
            >
              Canvas
            </button>
            <button
              onClick={() => setMode("orb")}
              className={`rounded-xl px-3 py-2 text-sm ${mode==="orb" ? "bg-zinc-800" : "bg-zinc-900/40"} border border-zinc-800`}
            >
              3D Orb
            </button>
          </div>
        </div>
      </Card>

      {mode === "canvas" ? (
        <Card title="Canvas">
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-sm text-zinc-300">
              Brush{" "}
              <input
                type="range"
                min="2"
                max="22"
                value={brush}
                onChange={(e) => setBrush(Number(e.target.value))}
                className="ml-2 align-middle"
              />
              <span className="ml-2 text-zinc-400">{brush}</span>
            </label>

            <label className="text-sm text-zinc-300">
              Ink{" "}
              <input
                type="color"
                value={ink}
                onChange={(e) => setInk(e.target.value)}
                className="ml-2 h-8 w-10 align-middle"
              />
            </label>

            <Button onClick={clear}>Clear</Button>
          </div>

          <div className="mt-4 flex items-center justify-center">
            <canvas ref={ref} className="rounded-2xl border border-zinc-800"></canvas>
          </div>

          <div className="mt-3 text-sm text-zinc-400">
            Tip: trace the target rune slowly. Speed comes later.
          </div>
        </Card>
      ) : (
        <Card title="Rune orb">
          <div className="h-[460px] rounded-2xl border border-zinc-800 bg-zinc-950">
            <RuneOrb glyph={target.glyph} />
          </div>
          <div className="mt-3 text-sm text-zinc-400">Drag to rotate. Scroll to zoom.</div>
        </Card>
      )}
    </div>
  );
}
