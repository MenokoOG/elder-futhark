import { Injectable } from "@nestjs/common";
import { InjectConnection } from "@nestjs/mongoose";
import type { Connection, Document, WithId } from "mongoose";
import { isoDayUTC, computeStreak, levelFromPoints } from "./stats.util";
import type { LeaderboardRow, StatsOverview } from "./stats.types";

/**
 * Collection names used by Stats.
 * Change these to match your actual schema/model names later.
 *
 * This module intentionally uses the raw Mongo connection so you
 * don't get blocked while other modules evolve.
 */
const COLLECTIONS = {
  // rituals / streaks
  ritual: "ritualentries",

  // spaced repetition cards
  study: "studyitems",

  // achievement unlocks
  achievements: "achievementunlocks",

  // quiz attempts
  quiz: "quizattempts",

  // drawing attempts (canvas recognition)
  drawing: "drawingattempts",

  // user profiles (for leaderboard handle lookup)
  users: "users"
} as const;

@Injectable()
export class StatsService {
  constructor(@InjectConnection() private readonly conn: Connection) {}

  private col(name: string) {
    return this.conn.collection(name);
  }

  private async safeCount(name: string, filter: Record<string, any>) {
    try {
      return await this.col(name).countDocuments(filter);
    } catch {
      return 0;
    }
  }

  private async safeFindDaysDesc(userId: string) {
    // ritual day can be stored as:
    // - { day: "YYYY-MM-DD" }
    // - or infer from { createdAt }
    // We'll read both patterns defensively.
    try {
      const docs = await this.col(COLLECTIONS.ritual)
        .find({ userId }, { projection: { day: 1, createdAt: 1, runeOfDayKey: 1 } })
        .sort({ day: -1, createdAt: -1 })
        .limit(120)
        .toArray();

      const days: string[] = [];
      for (const d of docs as any[]) {
        const day =
          typeof d.day === "string" ? d.day :
          d.createdAt ? isoDayUTC(new Date(d.createdAt)) :
          null;

        if (day) days.push(day);
      }

      // de-dupe while keeping order
      const seen = new Set<string>();
      const uniq: string[] = [];
      for (const day of days) {
        if (seen.has(day)) continue;
        seen.add(day);
        uniq.push(day);
      }

      const lastRitualDay = uniq[0] ?? null;
      const runeOfDayKey = (docs?.[0] as any)?.runeOfDayKey ?? null;

      return { daysDesc: uniq, lastRitualDay, runeOfDayKey };
    } catch {
      return { daysDesc: [], lastRitualDay: null, runeOfDayKey: null };
    }
  }

  private async safeLongestStreak(userId: string) {
    // brute-force from last 365 days worth of ritual entries, de-duped by day
    try {
      const docs = await this.col(COLLECTIONS.ritual)
        .find({ userId }, { projection: { day: 1, createdAt: 1 } })
        .sort({ day: -1, createdAt: -1 })
        .limit(365)
        .toArray();

      const days: string[] = [];
      for (const d of docs as any[]) {
        const day =
          typeof d.day === "string" ? d.day :
          d.createdAt ? isoDayUTC(new Date(d.createdAt)) :
          null;

        if (day) days.push(day);
      }

      const set = new Set(days);
      const uniqAsc = Array.from(set).sort(); // ascending for scanning

      // scan ascending to compute longest consecutive run
      let best = 0;
      let cur = 0;

      let prevDate: Date | null = null;
      for (const day of uniqAsc) {
        const dt = new Date(`${day}T00:00:00.000Z`);
        if (!prevDate) {
          cur = 1;
          best = Math.max(best, cur);
          prevDate = dt;
          continue;
        }
        const diff = Math.round((dt.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
        if (diff === 1) cur += 1;
        else cur = 1;

        best = Math.max(best, cur);
        prevDate = dt;
      }

      return best;
    } catch {
      return 0;
    }
  }

  private async safeStudyStats(userId: string) {
    // study schema assumptions (flexible):
    // { userId, dueAt/nextReviewAt, state, ease }
    const now = new Date();

    try {
      const col = this.col(COLLECTIONS.study);

      const totalCards = await col.countDocuments({ userId });

      const dueNow = await col.countDocuments({
        userId,
        $or: [
          { nextReviewAt: { $lte: now } },
          { dueAt: { $lte: now } }
        ]
      });

      const learning = await col.countDocuments({
        userId,
        $or: [{ state: "learning" }, { intervalDays: { $lte: 7 } }]
      });

      const mature = await col.countDocuments({
        userId,
        $or: [{ state: "mature" }, { intervalDays: { $gte: 21 } }]
      });

      const easeAgg = await col
        .aggregate([
          { $match: { userId, ease: { $type: "number" } } },
          { $group: { _id: null, avgEase: { $avg: "$ease" } } }
        ])
        .toArray();

      const avgEase = easeAgg?.[0]?.avgEase ?? null;

      return { totalCards, dueNow, learning, mature, avgEase };
    } catch {
      return { totalCards: 0, dueNow: 0, learning: 0, mature: 0, avgEase: null as number | null };
    }
  }

  private async safeQuizStats(userId: string) {
    // expected fields:
    // { userId, score (0-100), createdAt }
    try {
      const col = this.col(COLLECTIONS.quiz);

      const attempts = await col.countDocuments({ userId });

      const agg = await col
        .aggregate([
          { $match: { userId, score: { $type: "number" } } },
          {
            $group: {
              _id: null,
              bestScore: { $max: "$score" },
              avgScore: { $avg: "$score" },
              lastAttemptAt: { $max: "$createdAt" }
            }
          }
        ])
        .toArray();

      const row = agg?.[0] ?? null;

      return {
        attempts,
        bestScore: row?.bestScore ?? null,
        avgScore: row?.avgScore ?? null,
        lastAttemptAt: row?.lastAttemptAt ? new Date(row.lastAttemptAt).toISOString() : null
      };
    } catch {
      return { attempts: 0, bestScore: null, avgScore: null, lastAttemptAt: null };
    }
  }

  private async safeDrawingStats(userId: string) {
    // expected fields:
    // { userId, matchScore (0..1 or 0..100), createdAt }
    try {
      const col = this.col(COLLECTIONS.drawing);

      const attempts = await col.countDocuments({ userId });

      const agg = await col
        .aggregate([
          { $match: { userId, matchScore: { $type: "number" } } },
          {
            $group: {
              _id: null,
              bestMatchScore: { $max: "$matchScore" },
              lastAttemptAt: { $max: "$createdAt" }
            }
          }
        ])
        .toArray();

      const row = agg?.[0] ?? null;

      return {
        attempts,
        bestMatchScore: row?.bestMatchScore ?? null,
        lastAttemptAt: row?.lastAttemptAt ? new Date(row.lastAttemptAt).toISOString() : null
      };
    } catch {
      return { attempts: 0, bestMatchScore: null, lastAttemptAt: null };
    }
  }

  private async safeAchievements(userId: string) {
    // expected fields:
    // { userId, key, unlockedAt/createdAt }
    try {
      const col = this.col(COLLECTIONS.achievements);

      const unlocked = await col.countDocuments({ userId });

      const recentDocs = await col
        .find({ userId }, { projection: { key: 1, unlockedAt: 1, createdAt: 1 } })
        .sort({ unlockedAt: -1, createdAt: -1 })
        .limit(5)
        .toArray();

      const recent = (recentDocs as any[]).map(d => ({
        key: String(d.key ?? "unknown"),
        unlockedAt: new Date(d.unlockedAt ?? d.createdAt ?? Date.now()).toISOString()
      }));

      return {
        unlocked,
        totalKnown: null as number | null,
        recent
      };
    } catch {
      return { unlocked: 0, totalKnown: null as number | null, recent: [] as any[] };
    }
  }

  /**
   * Points model (simple and fun; adjust anytime):
   * - 5 pts per ritual day
   * - 1 pt per study card
   * - +25 per achievement
   * - + (quiz avg / 4) scaled
   * - + (drawing best) scaled
   */
  private computePoints(input: {
    ritualDays: number;
    studyCards: number;
    achievementsUnlocked: number;
    quizAvg: number | null;
    drawingBest: number | null;
  }) {
    const ritualPts = input.ritualDays * 5;
    const studyPts = input.studyCards * 1;
    const achievementPts = input.achievementsUnlocked * 25;

    const quizPts = input.quizAvg ? Math.round(input.quizAvg / 4) : 0;

    const drawingPts =
      input.drawingBest == null
        ? 0
        : input.drawingBest <= 1
          ? Math.round(input.drawingBest * 100) // 0..1 scale
          : Math.round(input.drawingBest); // 0..100 scale

    return ritualPts + studyPts + achievementPts + quizPts + drawingPts;
  }

  async getOverview(userId: string): Promise<StatsOverview> {
    const nowIso = new Date().toISOString();

    const ritualDaysCount = await this.safeCount(COLLECTIONS.ritual, { userId });
    const { daysDesc, lastRitualDay, runeOfDayKey } = await this.safeFindDaysDesc(userId);

    const currentStreak = computeStreak(daysDesc);
    const longestStreak = await this.safeLongestStreak(userId);

    const study = await this.safeStudyStats(userId);
    const achievements = await this.safeAchievements(userId);
    const quiz = await this.safeQuizStats(userId);
    const drawing = await this.safeDrawingStats(userId);

    const points = this.computePoints({
      ritualDays: ritualDaysCount,
      studyCards: study.totalCards,
      achievementsUnlocked: achievements.unlocked,
      quizAvg: quiz.avgScore,
      drawingBest: drawing.bestMatchScore
    });

    const { level, nextLevelAt } = levelFromPoints(points);

    return {
      userId,

      points,
      level,
      nextLevelAt,

      ritual: {
        currentStreak,
        longestStreak,
        totalRitualDays: ritualDaysCount,
        lastRitualDay,
        runeOfDayKey
      },

      study,

      achievements,

      quiz,

      drawing,

      updatedAt: nowIso
    };
  }

  async getLeaderboard(limit = 10): Promise<LeaderboardRow[]> {
    // If you later store a StatsSnapshot per user, this should read from that.
    // For now, we compute "points" from collections quickly. Keep it small.
    const safeLimit = Math.max(1, Math.min(50, limit));

    // Approach:
    // - Start from users collection (top N by createdAt desc)
    // - Compute overview per user (N is small)
    // This is intentionally not heavy.
    try {
      const users = await this.col(COLLECTIONS.users)
        .find({}, { projection: { _id: 1, handle: 1 }, sort: { createdAt: -1 }, limit: safeLimit })
        .toArray();

      const rows: LeaderboardRow[] = [];
      for (const u of users as any[]) {
        const id = String(u._id);
        const overview = await this.getOverview(id);
        rows.push({
          userId: id,
          handle: u.handle ?? null,
          points: overview.points,
          level: overview.level,
          updatedAt: overview.updatedAt
        });
      }

      rows.sort((a, b) => b.points - a.points);
      return rows.slice(0, safeLimit);
    } catch {
      return [];
    }
  }
}