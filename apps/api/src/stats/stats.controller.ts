import { Controller, Get, Query, Req, UseGuards } from "@nestjs/common";
import { StatsService } from "./stats.service";
import { getUserIdFromReq } from "./stats.util";

// If your project uses a different guard name, change this import.
import { JwtGuard } from "../common/auth/jwt.guard";

@UseGuards(JwtGuard)
@Controller("stats")
export class StatsController {
  constructor(private readonly stats: StatsService) {}

  @Get()
  async overview(@Req() req: any) {
    const userId = getUserIdFromReq(req);
    const o = await this.stats.getOverview(userId);

    return {
      userId: o.userId,
      streakDays: o.ritual.currentStreak,
      totalStudyReviews: o.study.totalCards ?? 0,
      achievementsUnlocked: o.achievements.unlocked ?? 0,
      lastRitualDate: o.ritual.lastRitualDay ? `${o.ritual.lastRitualDay}T00:00:00.000Z` : null,
      bestQuizByAett: { "1": 0, "2": 0, "3": 0 }
    };
  }

  @Get("me")
  async me(@Req() req: any) {
    const userId = getUserIdFromReq(req);
    return this.stats.getOverview(userId);
  }

  @Get("leaderboard")
  async leaderboard(@Query("limit") limit?: string) {
    const n = limit ? Number(limit) : 10;
    return this.stats.getLeaderboard(Number.isFinite(n) ? n : 10);
  }
}