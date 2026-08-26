export const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

export function randBetween(a, b) {
  return a + Math.random() * (b - a);
}

export function choice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
