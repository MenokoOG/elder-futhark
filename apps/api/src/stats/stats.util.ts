import type { Request } from "express";

/**
 * Extract a user id from common JWT payload conventions:
 * - req.user.sub (Passport JWT standard)
 * - req.user.userId
 * - req.user.id
 */
export function getUserIdFromReq(req: Request): string {
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

/** YYYY-MM-DD in UTC (stable for streak math) */
export function isoDayUTC(d: Date) {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** parse YYYY-MM-DD safely */
export function parseIsoDayUTC(s: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const [y, m, d] = s.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return Number.isFinite(dt.getTime()) ? dt : null;
}

/**
 * Consecutive-day streak calculation.
 * Expects an array of YYYY-MM-DD, newest-first.
 */
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
    if (diffDays === 0) {
      // duplicate day, ignore
      continue;
    }
    break;
  }

  return streak;
}

/** Simple level curve; tweak freely */
export function levelFromPoints(points: number) {
  // level n requires 150*n*(n-1) points (quadratic growth)
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