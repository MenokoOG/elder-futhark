import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Rune, RuneDocument } from "./rune.schema";

@Injectable()
export class RunesService {
  constructor(@InjectModel(Rune.name) private runeModel: Model<RuneDocument>) {}

  async list(q?: string, aett?: number) {
    const filter: any = {};
    if (aett) filter.aett = aett;

    if (q && q.trim()) {
      const rx = new RegExp(q.trim(), "i");
      filter.$or = [{ key: rx }, { name: rx }, { phonetic: rx }, { meaning: rx }];
    }

    return this.runeModel.find(filter).sort({ aett: 1, name: 1 }).lean().exec();
  }

  async byKey(key: string) {
    return this.runeModel.findOne({ key }).lean().exec();
  }

  async random() {
    const [one] = await this.runeModel.aggregate([{ $sample: { size: 1 } }]).exec();
    return one ?? null;
  }
}