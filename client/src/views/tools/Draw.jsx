import React from "react";
import { Card } from "../../ui/components/Card.jsx";
import { Button } from "../../ui/components/Button.jsx";
import { ELDER_FUTHARK } from "../../lib/elderFuthark.js";
import { choice } from "../../lib/math.js";
import { recognizeRuneFromStroke } from "../../lib/drawing/recognizeRuneFromStroke.js";

const PASS_THRESHOLD = 0.54;
const MIN_POINTS = 18;

function useCanvasDraw() {
  const ref = React.useRef(null);
  const strokesRef = React.useRef([]);
  const activeStrokeRef = React.useRef(null);
  const [revision, setRevision] = React.useState(0);
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
      ctx.setTransform(
        window.devicePixelRatio,
        0,
        0,
        window.devicePixelRatio,
        0,
        0,
      );
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

    const pos = (e) => {
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      return { x, y };
    };

    const appendPoint = (stroke, point) => {
      const lastPoint = stroke[stroke.length - 1];
      if (!lastPoint) {
        stroke.push(point);
        return;
      }
      const dx = point.x - lastPoint.x;
      const dy = point.y - lastPoint.y;
      if (dx * dx + dy * dy >= 4) stroke.push(point);
    };

    const down = (e) => {
      drawing = true;
      const start = pos(e);
      activeStrokeRef.current = [start];
      canvas.setPointerCapture(e.pointerId);
    };

    const move = (e) => {
      if (!drawing) return;
      const stroke = activeStrokeRef.current;
      if (!stroke) return;

      const p = pos(e);
      const last = stroke[stroke.length - 1];
      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      appendPoint(stroke, p);
    };

    const up = (e) => {
      if (!drawing) return;
      drawing = false;
      const stroke = activeStrokeRef.current;
      activeStrokeRef.current = null;

      if (stroke && stroke.length > 1) {
        strokesRef.current.push(stroke);
        setRevision((v) => v + 1);
      }

      if (e?.pointerId != null && canvas.hasPointerCapture(e.pointerId)) {
        canvas.releasePointerCapture(e.pointerId);
      }
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
  }, []);

  const clear = React.useCallback(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, w, h);
    strokesRef.current = [];
    activeStrokeRef.current = null;
    setRevision((v) => v + 1);
  }, []);

  const getPoints = React.useCallback(() => {
    return strokesRef.current.flatMap((stroke) =>
      stroke.map((point) => ({ x: point.x, y: point.y })),
    );
  }, []);

  const strokeCount = strokesRef.current.length;
  const pointCount = React.useMemo(
    () => strokesRef.current.reduce((sum, stroke) => sum + stroke.length, 0),
    [revision],
  );

  return {
    ref,
    brush,
    setBrush,
    ink,
    setInk,
    clear,
    getPoints,
    strokeCount,
    pointCount,
    hasInk: pointCount > 0,
  };
}

export function Draw() {
  const [target, setTarget] = React.useState(() => choice(ELDER_FUTHARK));
  const [matchResult, setMatchResult] = React.useState(null);
  const {
    ref,
    brush,
    setBrush,
    ink,
    setInk,
    clear,
    getPoints,
    strokeCount,
    pointCount,
    hasInk,
  } = useCanvasDraw();

  const pickNewTarget = React.useCallback(() => {
    clear();
    setMatchResult(null);
    setTarget(choice(ELDER_FUTHARK));
  }, [clear]);

  const handleClear = React.useCallback(() => {
    clear();
    setMatchResult(null);
  }, [clear]);

  const checkMatch = React.useCallback(() => {
    const points = getPoints();
    if (points.length < MIN_POINTS) {
      setMatchResult({
        pass: false,
        reason: "Draw a little more before checking.",
        targetScore: 0,
        top: null,
      });
      return;
    }

    const ranked = recognizeRuneFromStroke(points);
    const top = ranked[0] || null;
    const targetHit = ranked.find((item) => item.key === target.key);
    const targetScore = targetHit?.score ?? 0;
    const pass = Boolean(
      top && top.key === target.key && targetScore >= PASS_THRESHOLD,
    );

    setMatchResult({
      pass,
      reason: pass ? "Solid match." : "Not quite yet.",
      targetScore,
      top,
      ranked: ranked.slice(0, 3),
    });
  }, [getPoints, target.key]);

  return (
    <div className="space-y-4">
      <Card title="Rune drawing lab">
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={pickNewTarget}>New target</Button>
          <div className="text-sm text-zinc-300">
            Target: <span className="text-zinc-100">{target.name}</span>{" "}
            <span className="text-zinc-500">({target.glyph})</span>
          </div>
          <div className="ml-auto text-xs text-zinc-400">
            {strokeCount} stroke{strokeCount === 1 ? "" : "s"} · {pointCount}{" "}
            points
          </div>
        </div>
      </Card>

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

          <Button onClick={handleClear}>Clear</Button>
          <Button onClick={checkMatch} disabled={!hasInk}>
            Check rune
          </Button>
        </div>

        <div className="mt-4 flex items-center justify-center">
          <canvas
            ref={ref}
            className="rounded-2xl border border-zinc-800"
          ></canvas>
        </div>

        {matchResult ? (
          <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950/40 p-3 text-sm">
            <div
              className={
                matchResult.pass ? "text-emerald-300" : "text-amber-300"
              }
            >
              {matchResult.pass ? "Matched target." : "Try again."}{" "}
              {matchResult.reason}
            </div>
            <div className="mt-1 text-zinc-300">
              Target confidence:{" "}
              <span className="text-zinc-100">
                {Math.round((matchResult.targetScore || 0) * 100)}%
              </span>
            </div>
            {matchResult.top ? (
              <div className="text-zinc-400">
                Closest match:{" "}
                <span className="text-zinc-200">{matchResult.top.name}</span>{" "}
                <span>({matchResult.top.glyph})</span>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="mt-3 text-sm text-zinc-400">
            Tip: trace the target rune slowly, then use Check rune.
          </div>
        )}
      </Card>
    </div>
  );
}
