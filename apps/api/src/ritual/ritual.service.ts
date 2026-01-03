import { Injectable } from "@nestjs/common";
import { runeOfDayKey } from "@efa/shared";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Progress, ProgressDocument } from "../progress/progress.schema";
import { ProgressService } from "../progress/progress.service";

function isoToday() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

@Injectable()
export class RitualService {
  constructor(
    private progressSvc: ProgressService,
    @InjectModel(Progress.name) private progressModel: Model<ProgressDocument>
  ) {}

  async getRuneOfDay(userId: string, isoDate?: string) {
    const date = isoDate ?? isoToday();
    const p = await this.progressSvc.ensureProgress(userId);
    const lastIso = p.lastRitualDate ? p.lastRitualDate.toISOString().slice(0, 10) : null;
    const claimedToday = lastIso === date;
    return { isoDate: date, runeKey: runeOfDayKey(date), streak: p.streak, claimedToday };
  }

  async claim(userId: string, isoDate?: string) {
    const date = isoDate ?? isoToday();
    const p = await this.progressSvc.ensureProgress(userId);

    const lastIso = p.lastRitualDate ? p.lastRitualDate.toISOString().slice(0, 10) : null;
    if (lastIso === date) {
      return { isoDate: date, runeKey: runeOfDayKey(date), streak: p.streak, claimedToday: true };
    }

    // streak logic: if last was yesterday -> +1 else reset to 1
    const last = p.lastRitualDate;
    let nextStreak = 1;

    if (last) {
      const lastIsoInner = last.toISOString().slice(0, 10);
      const lastDate = new Date(lastIsoInner + "T00:00:00Z");
      const curDate = new Date(date + "T00:00:00Z");
      const diffDays = Math.round((curDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) nextStreak = p.streak + 1;
    }

    p.streak = nextStreak;
    p.lastRitualDate = new Date(date + "T00:00:00Z");
    await this.progressModel.updateOne({ userId }, { $set: { streak: p.streak, lastRitualDate: p.lastRitualDate } }).exec();

    // Achievements
    await this.progressSvc.unlockAchievement(userId, "FIRST_RITUAL");
    if (p.streak >= 7) await this.progressSvc.unlockAchievement(userId, "STREAK_7");
    if (p.streak >= 30) await this.progressSvc.unlockAchievement(userId, "STREAK_30");

    return { isoDate: date, runeKey: runeOfDayKey(date), streak: p.streak, claimedToday: true };
  }
}