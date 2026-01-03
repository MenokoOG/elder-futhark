import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Achievement, AchievementDocument } from "./achievement.schema";
import { Progress, ProgressDocument } from "./progress.schema";

@Injectable()
export class ProgressService {
  constructor(
    @InjectModel(Progress.name) private progressModel: Model<ProgressDocument>,
    @InjectModel(Achievement.name) private achievementModel: Model<AchievementDocument>
  ) {}

  async ensureProgress(userId: string) {
    let p = await this.progressModel.findOne({ userId }).exec();
    if (!p) {
      p = await this.progressModel.create({
        userId,
        streak: 0,
        lastRitualDate: null,
        totalStudyReviews: 0,
        bestQuizByAett: {}
      });
    }
    return p;
  }

  async unlockAchievement(userId: string, key: string) {
    const now = new Date().toISOString();
    try {
      await this.achievementModel.create({ userId, key, unlockedAt: now });
      return true;
    } catch {
      return false;
    }
  }

  async listAchievements(userId: string) {
    return this.achievementModel.find({ userId }).sort({ unlockedAt: 1 }).lean().exec();
  }
}