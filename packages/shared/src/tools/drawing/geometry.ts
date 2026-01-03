export type Pt = { x: number; y: number };

export type Stroke = Pt[];

export type BBox = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  w: number;
  h: number;
};

export function bboxOf(points: Pt[]): BBox {
  if (!points.length) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0, w: 0, h: 0 };
  }

  let minX = points[0]!.x;
  let minY = points[0]!.y;
  let maxX = points[0]!.x;
  let maxY = points[0]!.y;

  for (let i = 1; i < points.length; i++) {
    const p = points[i]!;
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
  }

  return {
    minX,
    minY,
    maxX,
    maxY,
    w: Math.max(0, maxX - minX),
    h: Math.max(0, maxY - minY)
  };
}

export function translate(points: Pt[], dx: number, dy: number): Pt[] {
  return points.map(p => ({ x: p.x + dx, y: p.y + dy }));
}

export function scale(points: Pt[], sx: number, sy: number): Pt[] {
  return points.map(p => ({ x: p.x * sx, y: p.y * sy }));
}

export function normalizeToUnit(points: Pt[]): Pt[] {
  const b = bboxOf(points);
  const w = b.w || 1;
  const h = b.h || 1;

  return points.map(p => ({
    x: (p.x - b.minX) / w,
    y: (p.y - b.minY) / h
  }));
}

/**
 * Compatibility export: some modules import `normalize(...)`.
 * Keep this so older code doesn't break.
 */
export function normalize(points: Pt[]): Pt[] {
  return normalizeToUnit(points);
}

export function pathLength(points: Pt[]): number {
  let sum = 0;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1]!;
    const b = points[i]!;
    sum += Math.hypot(b.x - a.x, b.y - a.y);
  }
  return sum;
}

export function resample(points: Pt[], n: number): Pt[] {
  if (n <= 1) return points.length ? [{ ...points[0]! }] : [];
  if (points.length === 0) return [];

  const total = pathLength(points);
  if (total === 0) {
    return Array.from({ length: n }, () => ({ ...points[0]! }));
  }

  const step = total / (n - 1);
  const out: Pt[] = [{ ...points[0]! }];

  let distAcc = 0;
  let i = 1;
  let prev = { ...points[0]! };

  while (i < points.length) {
    const cur = points[i]!;
    const dx = cur.x - prev.x;
    const dy = cur.y - prev.y;
    const seg = Math.hypot(dx, dy);

    if (seg === 0) {
      i += 1;
      continue;
    }

    if (distAcc + seg >= step) {
      const t = (step - distAcc) / seg;
      const np = { x: prev.x + t * dx, y: prev.y + t * dy };
      out.push(np);
      prev = np;
      distAcc = 0;
      if (out.length === n) break;
    } else {
      distAcc += seg;
      prev = cur;
      i += 1;
    }
  }

  while (out.length < n) {
    out.push({ ...points[points.length - 1]! });
  }

  return out;
}

export function centroid(points: Pt[]): Pt {
  if (!points.length) return { x: 0, y: 0 };
  let sx = 0;
  let sy = 0;
  for (const p of points) {
    sx += p.x;
    sy += p.y;
  }
  return { x: sx / points.length, y: sy / points.length };
}

export function directions(points: Pt[]): number[] {
  if (points.length < 2) return [];
  const out: number[] = [];
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1]!;
    const b = points[i]!;
    out.push(Math.atan2(b.y - a.y, b.x - a.x));
  }
  return out;
}

export function directionHistogram(points: Pt[], bins = 12): number[] {
  const dirs = directions(points);
  if (dirs.length === 0) return Array.from({ length: bins }, () => 0);

  const hist = Array.from({ length: bins }, () => 0);
  const twoPi = Math.PI * 2;

  for (const ang of dirs) {
    const a = (ang + twoPi) % twoPi;
    const idx = Math.min(bins - 1, Math.floor((a / twoPi) * bins));
    hist[idx] += 1;
  }

  const sum = hist.reduce((s, v) => s + v, 0) || 1;
  return hist.map(v => v / sum);
}

export function cosineSimilarity(a: number[], b: number[]): number {
  const n = Math.min(a.length, b.length);
  if (n === 0) return 0;

  let dot = 0;
  let na = 0;
  let nb = 0;

  for (let i = 0; i < n; i++) {
    const x = a[i]!;
    const y = b[i]!;
    dot += x * y;
    na += x * x;
    nb += y * y;
  }

  const denom = Math.sqrt(na) * Math.sqrt(nb);
  return denom === 0 ? 0 : dot / denom;
}

/**
 * Compatibility export: some modules import `cosineSim(...)`.
 * Keep this so older code doesn't break.
 */
export function cosineSim(a: number[], b: number[]): number {
  return cosineSimilarity(a, b);
}
