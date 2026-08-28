import React from "react";
import { ELDER_FUTHARK } from "../../lib/elderFuthark.js";
import { choice } from "../../lib/math.js";
import { recognizeRuneFromStroke } from "../../lib/drawing/recognizeRuneFromStroke.js";
import { Button } from "../../ui/components/Button.jsx";
import { StrokeOrder } from "../../ui/components/RuneFigure.jsx";

const SENSITIVITY = {
  easy: { threshold: 0.42, nearTopMargin: 0.1, label: "Easy" },
  normal: { threshold: 0.46, nearTopMargin: 0.07, label: "Normal" },
  strict: { threshold: 0.54, nearTopMargin: 0.04, label: "Strict" },
};
const MIN_POINTS = 18;
const INKS = ["#8c491a", "#2e2b25", "#56633f", "#b2622d"];
const CANVAS_BG = "#f9f4ed";

export function Draw() {
  const ref = React.useRef(null);
  const strokes = React.useRef([]);
  const active = React.useRef(null);
  const [target, setTarget] = React.useState(() => choice(ELDER_FUTHARK));
  const [sensitivity, setSensitivity] = React.useState("normal");
  const [brush, setBrush] = React.useState(8);
  const [ink, setInk] = React.useState(INKS[0]);
  const [counts, setCounts] = React.useState({ strokes: 0, points: 0 });
  const [match, setMatch] = React.useState(null);

  /** Repaint the ground plus the faint target guide. */
  const paintGuide = React.useCallback(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = CANVAS_BG;
    ctx.fillRect(0, 0, w, h);
    ctx.save();
    ctx.font = `${Math.round(h * 0.6)}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(100,92,80,0.13)";
    ctx.fillText(target.glyph, w / 2, h / 2);
    ctx.restore();
  }, [target]);

  React.useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.min(canvas.parentElement.clientWidth - 4, 760);
      const h = 400;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      paintGuide();
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [paintGuide]);

  React.useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let drawing = false;

    const pos = (e) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    const down = (e) => { drawing = true; active.current = [pos(e)]; canvas.setPointerCapture(e.pointerId); };
    const move = (e) => {
      if (!drawing || !active.current) return;
      const p = pos(e);
      const last = active.current[active.current.length - 1];
      ctx.strokeStyle = ink;
      ctx.lineWidth = brush;
      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      const dx = p.x - last.x, dy = p.y - last.y;
      if (dx * dx + dy * dy >= 4) active.current.push(p);
    };
    const up = () => {
      if (!drawing) return;
      drawing = false;
      if (active.current && active.current.length > 1) strokes.current.push(active.current);
      active.current = null;
      setCounts({ strokes: strokes.current.length, points: strokes.current.reduce((n, s) => n + s.length, 0) });
    };

    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);
    return () => {
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
    };
  }, [brush, ink]);

  const clear = () => {
    strokes.current = [];
    active.current = null;
    paintGuide();
    setCounts({ strokes: 0, points: 0 });
    setMatch(null);
  };

  const newTarget = () => {
    strokes.current = [];
    setCounts({ strokes: 0, points: 0 });
    setMatch(null);
    setTarget(choice(ELDER_FUTHARK));
  };

  const checkMatch = () => {
    const points = strokes.current.flatMap((s) => s.map((p) => ({ x: p.x, y: p.y })));
    const profile = SENSITIVITY[sensitivity] || SENSITIVITY.normal;
    if (points.length < MIN_POINTS) {
      setMatch({ pass: false, reason: "Draw a little more before checking.", targetScore: 0, top: null });
      return;
    }
    const ranked = recognizeRuneFromStroke(points);
    const top = ranked[0] || null;
    const hit = ranked.find((x) => x.key === target.key);
    const targetScore = hit?.score ?? 0;
    const closeToTop = Boolean(top && targetScore >= top.score - profile.nearTopMargin);
    const pass = Boolean(top && targetScore >= profile.threshold && (top.key === target.key || closeToTop));
    setMatch({ pass, reason: pass ? "Solid match." : "Not quite yet.", targetScore, top });
  };

  React.useEffect(() => { paintGuide(); }, [paintGuide]);

  return (
    <div className="grid items-start gap-6 min-[900px]:grid-cols-[minmax(0,1fr)_268px]">
      <div className="card flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="grid h-[54px] w-[54px] place-items-center rounded-full text-[30px]"
              style={{ background: "var(--pt)", color: "var(--pd)" }}>{target.glyph}</span>
            <span>
              <span className="block text-[10.5px] uppercase tracking-[0.14em] text-neutral-700">Target</span>
              <span className="block font-heading text-[21px]">{target.name}</span>
            </span>
          </div>
          <span className="text-[12.5px] text-neutral-700">
            {counts.strokes} stroke{counts.strokes === 1 ? "" : "s"} · {counts.points} points
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-4 rounded-lg px-5 py-4" style={{ background: "var(--pt)" }}>
          <StrokeOrder runeKey={target.key} color="var(--pd)" className="h-[92px] w-[92px] flex-none overflow-visible" />
          <div className="min-w-[180px] flex-1">
            <div className="text-[10.5px] uppercase tracking-[0.14em] text-neutral-700">Stroke order</div>
            <div className="max-w-[42ch] text-sm leading-normal text-neutral-700">Draw the strokes in this order and the score climbs.</div>
          </div>
        </div>

        <div className="flex justify-center rounded-lg bg-neutral-200 p-4">
          <canvas ref={ref} className="max-w-full rounded-md shadow-sm" style={{ background: CANVAS_BG, touchAction: "none", cursor: "crosshair" }} />
        </div>

        {match ? (
          <div className="rounded-md border p-4"
            style={{ background: match.pass ? "#f0fae1" : "#fff2eb", borderColor: "var(--color-divider)" }}>
            <div className="font-semibold" style={{ color: match.pass ? "#3d472b" : "#643312" }}>
              {match.pass ? "Matched the target." : "Try again."} {match.reason}
            </div>
            <div className="text-sm text-neutral-700">
              Target confidence {Math.round((match.targetScore || 0) * 100)}% · closest {match.top ? `${match.top.name} ${match.top.glyph}` : "—"}
            </div>
          </div>
        ) : (
          <div className="text-[13.5px] text-neutral-700">Trace the target slowly, then check it.</div>
        )}
      </div>

      <aside className="card flex flex-col gap-4" style={{ background: "#eee7db" }}>
        <label className="flex flex-col gap-1.5 text-[13px] uppercase tracking-[0.1em] text-neutral-700">
          Brush {brush}
          <input type="range" min="2" max="22" value={brush} onChange={(e) => setBrush(Number(e.target.value))} style={{ accentColor: "var(--pa)" }} />
        </label>

        <div className="flex flex-col gap-1.5">
          <span className="text-[13px] uppercase tracking-[0.1em] text-neutral-700">Ink</span>
          <div className="flex gap-2">
            {INKS.map((value) => (
              <button key={value} onClick={() => setInk(value)} aria-label={`ink ${value}`}
                className="h-[34px] w-[34px] rounded-full border-2"
                style={{ background: value, borderColor: ink === value ? "#2e2b25" : "transparent" }} />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-[13px] uppercase tracking-[0.1em] text-neutral-700">Sensitivity</span>
          <div className="flex gap-1 rounded-full bg-neutral-100 p-1">
            {Object.entries(SENSITIVITY).map(([key, value]) => (
              <button key={key} onClick={() => setSensitivity(key)}
                className={`flex-1 rounded-full px-1 py-1.5 text-[13px] ${sensitivity === key ? "bg-neutral-800 text-neutral-100" : "text-neutral-700"}`}>
                {value.label}
              </button>
            ))}
          </div>
        </div>

        <Button variant="primary" block onClick={checkMatch} disabled={!counts.points}>Check rune</Button>
        <Button block onClick={clear}>Clear</Button>
        <Button variant="ghost" block onClick={newTarget}>New target</Button>
      </aside>
    </div>
  );
}
