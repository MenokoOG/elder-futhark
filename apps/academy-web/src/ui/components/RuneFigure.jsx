import React from "react";
import { runePaths } from "../../lib/runeGeometry.js";

/**
 * A rune drawn as line geometry, from the same stroke templates the
 * recognizer scores against (lib/drawing/recognizeRuneFromStroke.js).
 */
export function RuneFigure({ runeKey, color = "currentColor", width = 3, className = "", style }) {
  const paths = runePaths(runeKey);
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden="true">
      {paths.map((d, i) => (
        <path key={i} d={d} fill="none" stroke={color} strokeWidth={width * 2} strokeLinecap="round" />
      ))}
    </svg>
  );
}

/** Same figure with numbered stroke-order badges. */
export function StrokeOrder({ runeKey, color = "currentColor", className = "" }) {
  const paths = runePaths(runeKey);
  const mids = paths.map((d) => {
    const [, x1, y1, x2, y2] = d.match(/M ([\d.]+) ([\d.]+) L ([\d.]+) ([\d.]+)/).map(Number);
    return { cx: (x1 + x2) / 2, cy: (y1 + y2) / 2 };
  });
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      {paths.map((d, i) => (
        <path key={i} d={d} fill="none" stroke={color} strokeWidth={5.5} strokeLinecap="round" />
      ))}
      {mids.map((m, i) => (
        <g key={i}>
          <circle cx={m.cx} cy={m.cy} r={10} fill="#f9f4ed" stroke={color} strokeWidth={1.6} />
          <text x={m.cx} y={m.cy} fill={color} fontSize={11} fontWeight={600} textAnchor="middle" dominantBaseline="central">{i + 1}</text>
        </g>
      ))}
    </svg>
  );
}
