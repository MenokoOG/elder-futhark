import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Progress, ProgressDocument } from "../progress/progress.schema";

@Injectable()
export class LoreService {
  [x: string]: any;
  constructor(
    @InjectModel(Progress.name) private readonly progressModel: Model<ProgressDocument>
  ) {}

  async unlockedAetts(userId: string): Promise<number[]> {
    const uid = new Types.ObjectId(userId);
    const p = await this.progressModel.findOne({ userId: uid }).exec();

    if (!p) return [];

    const unlocked: number[] = [1]; // Aett 1 always available

    const best = p.bestQuizByAett;

    const a1 = best?.get("1") ?? 0;
    const a2 = best?.get("2") ?? 0;
    const a3 = best?.get("3") ?? 0;

    if (a1 >= 8) unlocked.push(1);
    if (a2 >= 8) unlocked.push(2);
    if (a3 >= 8) unlocked.push(3);

    // de-dupe & keep sorted
    return Array.from(new Set(unlocked)).sort((a, b) => a - b);
  }
}
