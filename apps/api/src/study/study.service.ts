import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { StudyItem, StudyItemDocument } from "../progress/study-item.schema";
import { Progress, ProgressDocument } from "../progress/progress.schema";
import { ELDER_FUTHARK, sm2Init, sm2Review } from "@efa/shared";
import { ProgressService } from "../progress/progress.service";

@Injectable()
export class StudyService {
  constructor(
    private progressSvc: ProgressService,
    @InjectModel(StudyItem.name) private studyModel: Model<StudyItemDocument>,
    @InjectModel(Progress.name) private progressModel: Model<ProgressDocument>
  ) {}

  async ensureDeck(userId: string) {
    const now = new Date();
    const dueNow = now.toISOString();

    for (const r of ELDER_FUTHARK) {
      const exists = await this.studyModel.findOne({ userId, runeKey: r.key }).select("_id").lean().exec();
      if (!exists) {
        const init = sm2Init(now);
        await this.studyModel.create({
          userId,
          runeKey: r.key,
          repetitions: init.repetitions,
          intervalDays: init.intervalDays,
          easeFactor: init.easeFactor,
          dueAt: dueNow,
          lapses: init.lapses
        });
      }
    }
  }

  async next(userId: string) {
    await this.ensureDeck(userId);

    const now = new Date().toISOString();
    const doc = await this.studyModel
      .findOne({ userId, dueAt: { $lte: now } })
      .sort({ dueAt: 1 })
      .lean()
      .exec();

    if (!doc) {
      // none due: return earliest upcoming
      const soon = await this.studyModel.findOne({ userId }).sort({ dueAt: 1 }).lean().exec();
      return soon;
    }
    return doc;
  }

  async grade(userId: string, runeKey: string, grade: 0|1|2|3|4|5) {
    const doc = await this.studyModel.findOne({ userId, runeKey }).exec();
    if (!doc) throw new Error("Study item missing");

    const next = sm2Review(
      {
        repetitions: doc.repetitions,
        intervalDays: doc.intervalDays,
        easeFactor: doc.easeFactor,
        dueAt: doc.dueAt,
        lapses: doc.lapses
      },
      grade,
      new Date()
    );

    doc.repetitions = next.repetitions;
    doc.intervalDays = next.intervalDays;
    doc.easeFactor = next.easeFactor;
    doc.dueAt = next.dueAt;
    doc.lapses = next.lapses;
    await doc.save();

    const p = await this.progressSvc.ensureProgress(userId);
    p.totalStudyReviews += 1;
    await this.progressModel.updateOne({ userId }, { $set: { totalStudyReviews: p.totalStudyReviews } }).exec();

    // achievements
    await this.progressSvc.unlockAchievement(userId, "SR_10_REVIEWS");
    if (p.totalStudyReviews >= 50) await this.progressSvc.unlockAchievement(userId, "SR_50_REVIEWS");

    return doc.toObject();
  }
}