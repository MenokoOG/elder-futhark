import React from "react";
import { Card, Button } from "@efa/ui";
import { recognizeRuneFromStroke } from "@efa/shared";
import { ELDER_FUTHARK } from "@efa/shared";
import { api } from "../../lib/api";
import { useAuth } from "../../lib/auth";

type Pt = { x: number; y: number };

function runeByKey(key: string) {
  return ELDER_FUTHARK.find(r => r.key === key);
}

export function DrawPage() {
  const { token } = useAuth();
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [strokes, setStrokes] = React.useState<Pt[][]>([]);
  const [matches, setMatches] = React.useState<any[]>([]);
  const [down, setDown] = React.useState(false);

  function resize() {
    const c = canvasRef.current;
    if (!c) return;
    const rect = c.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    c.width = Math.floor(rect.width * dpr);
    c.height = Math.floor(rect.height * dpr);
    const ctx = c.getContext("2d")!;
    ctx.scale(dpr, dpr);
    redraw();
  }

  function redraw() {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;
    const rect = c.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);

    // background grid
    ctx.globalAlpha = 0.25;
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    for (let x = 0; x < rect.width; x += 24) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, rect.height);
      ctx.stroke();
    }
    for (let y = 0; y < rect.height; y += 24) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(rect.width, y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // strokes
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "rgba(255,255,255,0.9)";
    for (const s of strokes) {
      if (s.length < 2) continue;
      ctx.beginPath();
      ctx.moveTo(s[0]!.x, s[0]!.y);
      for (let i = 1; i < s.length; i++) ctx.lineTo(s[i]!.x, s[i]!.y);
      ctx.stroke();
    }
  }

  React.useEffect(() => {
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  React.useEffect(() => {
    redraw();
  }, [strokes]);

  function toCanvasPoint(e: React.PointerEvent) {
    const c = canvasRef.current!;
    const rect = c.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function onDown(e: React.PointerEvent) {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setDown(true);
    const first = toCanvasPoint(e);
    setStrokes((prev) => [...prev, [first]]);
  }

  function onMove(e: React.PointerEvent) {
    if (!down) return;
    const p = toCanvasPoint(e);
    setStrokes((prev) => {
      if (prev.length === 0) return [[p]];
      const next = [...prev];
      next[next.length - 1] = [...next[next.length - 1], p];
      return next;
    });
  }

  function onUp() {
    setDown(false);
  }

  async function recognize() {
    const flat: Pt[] = strokes.flat();
    const m = recognizeRuneFromStroke(flat).map(x => ({
      ...x,
      rune: runeByKey(x.key)
    }));
    setMatches(m);

    // Achievement ping (purely for showing off)
    if (token) {
      try {
        await api.get("/progress"); // ensure progress exists; achievements are server-side
      } catch {}
    }
  }

  function clear() {
    setStrokes([]);
    setMatches([]);
  }

  return (
    <div className="grid gap-4">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight">Rune Drawing Recognition</h2>
        <p className="text-sm text-white/60">
          Zero-ML recognizer using direction histograms + rune segment templates. Draw a rune and hit Recognize.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <div className="text-xs text-white/60 font-mono">canvas</div>
          <div className="mt-2 h-[360px] w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            <canvas
              ref={canvasRef}
              className="h-full w-full touch-none"
              onPointerDown={onDown}
              onPointerMove={onMove}
              onPointerUp={onUp}
              onPointerCancel={onUp}
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button onClick={recognize} disabled={strokes.flat().length === 0}>Recognize</Button>
            <Button variant="ghost" onClick={clear}>Clear</Button>
          </div>
        </Card>

        <Card>
          <div className="text-xs text-white/60 font-mono">matches</div>
          {matches.length === 0 ? (
            <div className="mt-3 text-white/60">No results yet. Draw something like ᚠ, ᛋ, ᛏ, ᛟ…</div>
          ) : (
            <div className="mt-3 grid gap-2">
              {matches.map((m: any) => (
                <div key={m.key} className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="flex items-center justify-between">
                    <div className="text-2xl rune-glow">{m.glyph}</div>
                    <div className="text-xs font-mono text-white/60">
                      score {m.score.toFixed(3)}
                    </div>
                  </div>
                  <div className="mt-1 font-bold">{m.name}</div>
                  <div className="text-xs text-white/60 font-mono">key: {m.key}</div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}