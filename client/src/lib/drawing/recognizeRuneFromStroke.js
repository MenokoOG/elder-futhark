import {
  directionHistogram,
  cosineSim,
  normalize,
  resample,
} from "./geometry.js";
import { ELDER_FUTHARK } from "../elderFuthark.js";

/**
 * Templates are straight segments in normalized 0..1 space.
 * This is "good enough" recognition without ML.
 */
const T = [
  // Aett 1
  {
    key: "fehu",
    segments: [
      [0.3, 0.1, 0.3, 0.9],
      [0.3, 0.2, 0.75, 0.4],
      [0.3, 0.45, 0.75, 0.65],
    ],
  },
  {
    key: "uruz",
    segments: [
      [0.3, 0.1, 0.3, 0.9],
      [0.3, 0.1, 0.75, 0.35],
      [0.75, 0.35, 0.75, 0.9],
    ],
  },
  {
    key: "thurisaz",
    segments: [
      [0.3, 0.1, 0.3, 0.9],
      [0.3, 0.35, 0.75, 0.55],
      [0.75, 0.55, 0.3, 0.75],
    ],
  },
  {
    key: "ansuz",
    segments: [
      [0.3, 0.1, 0.3, 0.9],
      [0.3, 0.25, 0.75, 0.45],
      [0.3, 0.45, 0.75, 0.65],
    ],
  },
  {
    key: "raidho",
    segments: [
      [0.3, 0.1, 0.3, 0.9],
      [0.3, 0.2, 0.75, 0.45],
      [0.75, 0.45, 0.3, 0.65],
    ],
  },
  {
    key: "kenaz",
    segments: [
      [0.7, 0.1, 0.3, 0.5],
      [0.3, 0.5, 0.7, 0.9],
    ],
  },
  {
    key: "gebo",
    segments: [
      [0.3, 0.2, 0.75, 0.8],
      [0.75, 0.2, 0.3, 0.8],
    ],
  },
  {
    key: "wunjo",
    segments: [
      [0.3, 0.1, 0.3, 0.9],
      [0.3, 0.2, 0.75, 0.45],
      [0.75, 0.45, 0.75, 0.75],
    ],
  },

  // Aett 2
  {
    key: "hagalaz",
    segments: [
      [0.3, 0.1, 0.3, 0.9],
      [0.75, 0.1, 0.75, 0.9],
      [0.3, 0.35, 0.75, 0.65],
    ],
  },
  {
    key: "nauthiz",
    segments: [
      [0.3, 0.1, 0.3, 0.9],
      [0.3, 0.55, 0.75, 0.35],
    ],
  },
  { key: "isa", segments: [[0.5, 0.1, 0.5, 0.9]] },
  {
    key: "jera",
    segments: [
      [0.3, 0.35, 0.55, 0.1],
      [0.55, 0.1, 0.75, 0.35],
      [0.75, 0.65, 0.55, 0.9],
      [0.55, 0.9, 0.3, 0.65],
    ],
  },
  {
    key: "eihwaz",
    segments: [
      [0.5, 0.1, 0.5, 0.9],
      [0.5, 0.35, 0.3, 0.2],
      [0.5, 0.65, 0.7, 0.8],
    ],
  },
  {
    key: "perthro",
    segments: [
      [0.3, 0.1, 0.3, 0.9],
      [0.3, 0.25, 0.75, 0.45],
      [0.75, 0.45, 0.3, 0.65],
    ],
  },
  {
    key: "algiz",
    segments: [
      [0.5, 0.1, 0.5, 0.9],
      [0.5, 0.35, 0.3, 0.2],
      [0.5, 0.35, 0.7, 0.2],
    ],
  },
  {
    key: "sowilo",
    segments: [
      [0.7, 0.1, 0.3, 0.35],
      [0.3, 0.35, 0.7, 0.65],
      [0.7, 0.65, 0.3, 0.9],
    ],
  },

  // Aett 3
  {
    key: "tiwaz",
    segments: [
      [0.5, 0.1, 0.5, 0.9],
      [0.3, 0.25, 0.5, 0.1],
      [0.7, 0.25, 0.5, 0.1],
    ],
  },
  {
    key: "berkano",
    segments: [
      [0.3, 0.1, 0.3, 0.9],
      [0.3, 0.2, 0.7, 0.4],
      [0.7, 0.4, 0.3, 0.55],
      [0.3, 0.55, 0.7, 0.75],
      [0.7, 0.75, 0.3, 0.9],
    ],
  },
  {
    key: "ehwaz",
    segments: [
      [0.3, 0.1, 0.3, 0.9],
      [0.75, 0.1, 0.75, 0.9],
      [0.3, 0.35, 0.75, 0.2],
      [0.3, 0.65, 0.75, 0.8],
    ],
  },
  {
    key: "mannaz",
    segments: [
      [0.3, 0.1, 0.3, 0.9],
      [0.75, 0.1, 0.75, 0.9],
      [0.3, 0.25, 0.75, 0.45],
    ],
  },
  {
    key: "laguz",
    segments: [
      [0.5, 0.1, 0.5, 0.9],
      [0.5, 0.55, 0.75, 0.75],
    ],
  },
  {
    key: "ingwaz",
    segments: [
      [0.5, 0.25, 0.7, 0.5],
      [0.7, 0.5, 0.5, 0.75],
      [0.5, 0.75, 0.3, 0.5],
      [0.3, 0.5, 0.5, 0.25],
    ],
  },
  {
    key: "dagaz",
    segments: [
      [0.35, 0.25, 0.65, 0.25],
      [0.35, 0.75, 0.65, 0.75],
      [0.35, 0.25, 0.65, 0.75],
      [0.65, 0.25, 0.35, 0.75],
    ],
  },
  {
    key: "othala",
    segments: [
      [0.5, 0.15, 0.75, 0.4],
      [0.75, 0.4, 0.5, 0.85],
      [0.5, 0.85, 0.25, 0.4],
      [0.25, 0.4, 0.5, 0.15],
      [0.35, 0.7, 0.65, 0.7],
    ],
  },
];

function templateToPoints(segments, samplesPerSeg = 24) {
  const pts = [];
  for (const [x1, y1, x2, y2] of segments) {
    for (let i = 0; i < samplesPerSeg; i++) {
      const t = i / (samplesPerSeg - 1);
      pts.push({ x: x1 + (x2 - x1) * t, y: y1 + (y2 - y1) * t });
    }
  }
  return pts;
}

function nearestSq(p, cloud) {
  let best = Infinity;
  for (const q of cloud) {
    const dx = p.x - q.x;
    const dy = p.y - q.y;
    const d2 = dx * dx + dy * dy;
    if (d2 < best) best = d2;
  }
  return best;
}

function symmetricCloudDistance(a, b) {
  if (!a.length || !b.length) return Infinity;
  let sumAB = 0;
  for (const p of a) sumAB += nearestSq(p, b);
  let sumBA = 0;
  for (const p of b) sumBA += nearestSq(p, a);
  return Math.sqrt((sumAB / a.length + sumBA / b.length) * 0.5);
}

function shapeScore(distance) {
  if (!Number.isFinite(distance)) return 0;
  return 1 / (1 + distance * 6);
}

const TEMPLATE_FEATURES = new Map();
for (const t of T) {
  const normalized = normalize(templateToPoints(t.segments));
  const pts = resample(normalized, 72);
  TEMPLATE_FEATURES.set(t.key, {
    hist: directionHistogram(pts, 12),
    cloud: resample(normalized, 144),
  });
}

export function recognizeRuneFromStroke(points) {
  if (!points || points.length < 8) return [];

  const normalized = normalize(points);
  const directionPts = resample(normalized, 72);
  const cloud = resample(normalized, 144);
  const h = directionHistogram(directionPts, 12);

  const out = [];
  for (const r of ELDER_FUTHARK) {
    const tf = TEMPLATE_FEATURES.get(r.key);
    if (!tf) continue;

    const direction = cosineSim(h, tf.hist);
    const shape = shapeScore(symmetricCloudDistance(cloud, tf.cloud));
    const score = shape * 0.7 + direction * 0.3;

    out.push({ key: r.key, name: r.name, glyph: r.glyph, score });
  }

  out.sort((a, b) => b.score - a.score);
  return out.slice(0, 6);
}
