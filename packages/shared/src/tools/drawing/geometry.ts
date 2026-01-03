xport type Pt = { x: number; y: number };

export function resample(points: Pt[], n = 64): Pt[] {
  if (points.length === 0) return [];
  const dists: number[] = [0];
  for (let i = 1; i < points.length; i++) {
    const dx = points[i]!.x - points[i - 1]!.x;
    const dy = points[i]!.y - points[i - 1]!.y;
    dists[i] = dists[i - 1]! + Math.hypot(dx, dy);
  }
  const total = dists[dists.length - 1]!;
  if (total === 0) return Array.from({ length: n }, () => ({ ...points[0]! }));

  const out: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const target = (i / (n - 1)) * total;
    let j = 1;
    while (j < dists.length && dists[j]! < target) j++;
    const a = points[j - 1]!;
    const b = points[Math.min(j, points.length - 1)]!;
    const da = dists[j - 1]!;
    const db = dists[Math.min(j, dists.length - 1)]!;
    const t = db === da ? 0 : (target - da) / (db - da);
    out.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
  }
  return out;
}

export function normalize(points: Pt[]): Pt[] {
  if (points.length === 0) return [];
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const p of points) {
    minX = Math.min(minX, p.x);
    minY = Math.min(minY, p.y);
    maxX = Math.max(maxX, p.x);
    maxY = Math.max(maxY, p.y);
  }
  const w = Math.max(1e-6, maxX - minX);
  const h = Math.max(1e-6, maxY - minY);
  return points.map(p => ({
    x: (p.x - minX) / w,
    y: (p.y - minY) / h
  }));
}

export function directionHistogram(points: Pt[], bins = 8): number[] {
  const hist = Array.from({ length: bins }, () => 0);
  for (let i = 1; i < points.length; i++) {
    const dx = points[i]!.x - points[i - 1]!.x;
    const dy = points[i]!.y - points[i - 1]!.y;
    const len = Math.hypot(dx, dy);
    if (len < 1e-6) continue;
    const ang = Math.atan2(dy, dx); // -pi..pi
    const a01 = (ang + Math.PI) / (2 * Math.PI); // 0..1
    const bin = Math.min(bins - 1, Math.floor(a01 * bins));
    hist[bin] += len;
  }
  const sum = hist.reduce((s, v) => s + v, 0) || 1;
  return hist.map(v => v / sum);
}

export function cosineSim(a: number[], b: number[]) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i]! * b[i]!;
    na += a[i]! * a[i]!;
    nb += b[i]! * b[i]!;
  }
  const denom = Math.sqrt(na) * Math.sqrt(nb) || 1e-9;
  return dot / denom;
}