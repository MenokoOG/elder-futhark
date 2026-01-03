import { Injectable } from "@nestjs/common";
import { LORE_LESSONS } from "@efa/shared";
import { ProgressService } from "../progress/progress.service";

@Injectable()
export class LoreService {
  constructor(private progressSvc: ProgressService) {}

  async list(userId: string) {
    const p = await this.progressSvc.ensureProgress(userId);
    const unlocked: (1|2|3)[] = [];
    if ((p.bestQuizByAett["1"] ?? 0) >= 8) unlocked.push(1);
    if ((p.bestQuizByAett["2"] ?? 0) >= 8) unlocked.push(2);
    if ((p.bestQuizByAett["3"] ?? 0) >= 8) unlocked.push(3);

    return {
      unlockedAetts: unlocked,
      lessons: LORE_LESSONS
    };
  }
}