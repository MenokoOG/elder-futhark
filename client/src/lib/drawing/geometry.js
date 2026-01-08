// Simple stroke utilities for rune recognition.

export function dist(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function pathLength(points) {
  let s = 0;
  for (let i = 1; i < points.length; i++) s += dist(points[i - 1], points[i]);
  return s;
}

export function normalize(points) {
  if (!points.length) return [];
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const p of points) {
    minX = Math.min(minX, p.x);
    minY = Math.min(minY, p.y);
    maxX = Math.max(maxX, p.x);
    maxY = Math.max(maxY, p.y);
  }
  const w = Math.max(1e-6, maxX - minX);
  const h = Math.max(1e-6, maxY - minY);
  const s = 1 / Math.max(w, h);

  return points.map((p) => ({
    x: (p.x - minX) * s,
    y: (p.y - minY) * s,
  }));
}

export function resample(points, n) {
  if (points.length === 0) return [];
  if (points.length === 1) return Array.from({ length: n }, () => ({ ...points[0] }));

  const total = pathLength(points);
  const step = total / (n - 1);

  const out = [{ ...points[0] }];
  let D = 0;

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const cur = points[i];
    const d = dist(prev, cur);

    if (d === 0) continue;

    while (D + d >= step) {
      const t = (step - D) / d;
      const nx = prev.x + t * (cur.x - prev.x);
      const ny = prev.y + t * (cur.y - prev.y);
      const np = { x: nx, y: ny };
      out.push(np);

      // move "prev" forward
      D = 0;
      prev.x = nx; // local mutation ok (only for loop), but keep stable by shadow copy
      prev.y = ny;
    }

    D += d;
  }

  while (out.length < n) out.push({ ...points[points.length - 1] });
  return out.slice(0, n);
}

export function directionHistogram(points, bins = 8) {
  const h = Array.from({ length: bins }, () => 0);
  if (points.length < 2) return h;

  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const ang = Math.atan2(dy, dx); // -pi..pi
    const t = (ang + Math.PI) / (2 * Math.PI); // 0..1
    let idx = Math.floor(t * bins);
    if (idx >= bins) idx = bins - 1;
    h[idx] += 1;
  }

  // normalize to unit sum
  const sum = h.reduce((s, v) => s + v, 0) || 1;
  return h.map((v) => v / sum);
}

export function cosineSim(a, b) {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  const denom = Math.sqrt(na) * Math.sqrt(nb) || 1e-9;
  return dot / denom;
}