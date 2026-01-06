import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { JwtGuard } from "../common/auth/jwt.guard";
import { getUserIdFromReq } from "../stats/stats.util";
import { LoreService } from "./lore.service";
import { LORE_LESSONS } from "@efa/shared";

@UseGuards(JwtGuard)
@Controller("lore")
export class LoreController {
  constructor(private readonly loreSvc: LoreService) {}

  @Get()
  async index(@Req() req: any) {
    const userId = getUserIdFromReq(req);
    const unlockedAetts = await this.loreSvc.unlockedAetts(userId);

    return {
      userId,
      unlockedAetts,
      lessons: LORE_LESSONS
    };
  }

  @Get("unlocked")
  async unlocked(@Req() req: any) {
    const userId = getUserIdFromReq(req);
    return {
      userId,
      unlockedAetts: await this.loreSvc.unlockedAetts(userId)
    };
  }
}