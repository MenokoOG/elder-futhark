import type { Pt } from "./geometry";
import { directionHistogram, cosineSim, normalize, resample } from "./geometry";
import { ELDER_FUTHARK } from "../../runes/elderFuthark";

/**
 * We approximate rune shapes as a set of straight segments in normalized space.
 * This enables a "good enough" recognizer with zero ML cost.
 */
export type Segment = [number, number, number, number]; // x1,y1,x2,y2

type Template = {
  key: string;
  segments: Segment[];
};

const T: Template[] = [
  // Aett 1
  { key: "fehu", segments: [[0.3,0.1,0.3,0.9],[0.3,0.2,0.75,0.4],[0.3,0.45,0.75,0.65]] },
  { key: "uruz", segments: [[0.3,0.1,0.3,0.9],[0.3,0.1,0.75,0.35],[0.75,0.35,0.75,0.9]] },
  { key: "thurisaz", segments: [[0.3,0.1,0.3,0.9],[0.3,0.35,0.75,0.55],[0.75,0.55,0.3,0.75]] },
  { key: "ansuz", segments: [[0.3,0.1,0.3,0.9],[0.3,0.25,0.75,0.45],[0.3,0.45,0.75,0.65]] },
  { key: "raidho", segments: [[0.3,0.1,0.3,0.9],[0.3,0.2,0.75,0.45],[0.75,0.45,0.3,0.65]] },
  { key: "kenaz", segments: [[0.7,0.1,0.3,0.5],[0.3,0.5,0.7,0.9]] },
  { key: "gebo", segments: [[0.3,0.2,0.75,0.8],[0.75,0.2,0.3,0.8]] },
  { key: "wunjo", segments: [[0.3,0.1,0.3,0.9],[0.3,0.2,0.75,0.45],[0.75,0.45,0.75,0.75]] },

  // Aett 2
  { key: "hagalaz", segments: [[0.3,0.1,0.3,0.9],[0.75,0.1,0.75,0.9],[0.3,0.35,0.75,0.65]] },
  { key: "nauthiz", segments: [[0.3,0.1,0.3,0.9],[0.3,0.55,0.75,0.35]] },
  { key: "isa", segments: [[0.5,0.1,0.5,0.9]] },
  { key: "jera", segments: [[0.3,0.35,0.55,0.1],[0.55,0.1,0.75,0.35],[0.75,0.65,0.55,0.9],[0.55,0.9,0.3,0.65]] },
  { key: "eihwaz", segments: [[0.5,0.1,0.5,0.9],[0.5,0.35,0.3,0.2],[0.5,0.65,0.7,0.8]] },
  { key: "perthro", segments: [[0.3,0.1,0.3,0.9],[0.3,0.25,0.75,0.45],[0.75,0.45,0.3,0.65]] },
  { key: "algiz", segments: [[0.5,0.1,0.5,0.9],[0.5,0.35,0.3,0.2],[0.5,0.35,0.7,0.2]] },
  { key: "sowilo", segments: [[0.7,0.1,0.3,0.35],[0.3,0.35,0.7,0.65],[0.7,0.65,0.3,0.9]] },

  // Aett 3
  { key: "tiwaz", segments: [[0.5,0.1,0.5,0.9],[0.3,0.25,0.5,0.1],[0.7,0.25,0.5,0.1]] },
  { key: "berkano", segments: [[0.3,0.1,0.3,0.9],[0.3,0.2,0.7,0.4],[0.7,0.4,0.3,0.55],[0.3,0.55,0.7,0.75],[0.7,0.75,0.3,0.9]] },
  { key: "ehwaz", segments: [[0.3,0.1,0.3,0.9],[0.75,0.1,0.75,0.9],[0.3,0.35,0.75,0.2],[0.3,0.65,0.75,0.8]] },
  { key: "mannaz", segments: [[0.3,0.1,0.3,0.9],[0.75,0.1,0.75,0.9],[0.3,0.25,0.75,0.45]] },
  { key: "laguz", segments: [[0.5,0.1,0.5,0.9],[0.5,0.55,0.75,0.75]] },
  { key: "ingwaz", segments: [[0.5,0.25,0.7,0.5],[0.7,0.5,0.5,0.75],[0.5,0.75,0.3,0.5],[0.3,0.5,0.5,0.25]] },
  { key: "dagaz", segments: [[0.35,0.25,0.65,0.25],[0.35,0.75,0.65,0.75],[0.35,0.25,0.65,0.75],[0.65,0.25,0.35,0.75]] },
  { key: "othala", segments: [[0.5,0.15,0.75,0.4],[0.75,0.4,0.5,0.85],[0.5,0.85,0.25,0.4],[0.25,0.4,0.5,0.15],[0.35,0.7,0.65,0.7]] }
];

function templateToPoints(segments: Segment[], samplesPerSeg = 24): Pt[] {
  const pts: Pt[] = [];
  for (const [x1,y1,x2,y2] of segments) {
    for (let i = 0; i < samplesPerSeg; i++) {
      const t = i / (samplesPerSeg - 1);
      pts.push({ x: x1 + (x2 - x1) * t, y: y1 + (y2 - y1) * t });
    }
  }
  return pts;
}

const TEMPLATE_HISTS = new Map<string, number[]>();
for (const t of T) {
  const pts = resample(normalize(templateToPoints(t.segments)), 64);
  TEMPLATE_HISTS.set(t.key, directionHistogram(pts, 8));
}

export type RecognitionMatch = { key: string; name: string; glyph: string; score: number };

export function recognizeRuneFromStroke(points: Pt[]): RecognitionMatch[] {
  if (points.length < 8) return [];
  const pts = resample(normalize(points), 64);
  const h = directionHistogram(pts, 8);

  const out: RecognitionMatch[] = [];
  for (const r of ELDER_FUTHARK) {
    const th = TEMPLATE_HISTS.get(r.key);
    if (!th) continue;
    const score = cosineSim(h, th);
    out.push({ key: r.key, name: r.name, glyph: r.glyph, score });
  }
  out.sort((a,b) => b.score - a.score);
  return out.slice(0, 6);
}