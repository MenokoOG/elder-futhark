import { Controller, Get, UseGuards } from "@nestjs/common";
import { JwtGuard } from "../common/auth/jwt.guard";
import { GetUser } from "../common/auth/get-user.decorator";
import { ProgressService } from "./progress.service";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Progress, ProgressDocument } from "./progress.schema";

@UseGuards(JwtGuard)
@Controller("progress")
export class ProgressController {
  constructor(
    private progressSvc: ProgressService,
    @InjectModel(Progress.name) private progressModel: Model<ProgressDocument>
  ) {}

  @Get()
  async get(@GetUser() user: any) {
    const p = await this.progressSvc.ensureProgress(user.userId);
    const achievements = await this.progressSvc.listAchievements(user.userId);

    return {
      streak: p.streak,
      totalStudyReviews: p.totalStudyReviews,
      bestQuizByAett: p.bestQuizByAett,
      achievements
    };
  }
}