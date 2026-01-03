export type MinimalRequest = {
  user?: any;
};

export function getUserIdFromReq(req: MinimalRequest): string {
  const u: any = (req as any).user;

  const id =
    u?.sub ??
    u?.userId ??
    u?.id ??
    u?._id ??
    null;

  if (!id) return "";
  return String(id);
}

export function isoDayUTC(d: Date) {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseIsoDayUTC(s: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const [y, m, d] = s.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return Number.isFinite(dt.getTime()) ? dt : null;
}

export function computeStreak(daysDesc: string[]): number {
  if (daysDesc.length === 0) return 0;

  const first = parseIsoDayUTC(daysDesc[0]);
  if (!first) return 0;

  let streak = 1;
  let prev = first;

  for (let i = 1; i < daysDesc.length; i++) {
    const cur = parseIsoDayUTC(daysDesc[i]);
    if (!cur) continue;

    const diffDays = Math.round((prev.getTime() - cur.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      streak += 1;
      prev = cur;
      continue;
    }
    if (diffDays === 0) continue;
    break;
  }

  return streak;
}

export function levelFromPoints(points: number) {
  let level = 1;
  while (true) {
    const next = level + 1;
    const neededForNext = 150 * next * (next - 1);
    if (points >= neededForNext) level = next;
    else break;
  }
  const nextLevelAt = 150 * (level + 1) * level;
  return { level, nextLevelAt };
}