import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import type { Rune } from "./rune.schema";
import { ELDER_FUTHARK } from "@efa/shared";

@Injectable()
export class RunesService {
  constructor(@InjectModel("Rune") private runeModel: Model<Rune>) {}

  async list(params: { q?: string; aett?: number }) {
    const { q, aett } = params;

    // Try DB first (if you seeded)
    const filter: any = {};
    if (aett) filter.aett = aett;
    if (q) {
      const rx = new RegExp(q, "i");
      filter.$or = [{ key: rx }, { name: rx }, { phonetic: rx }, { notes: rx }];
    }

    const db = await this.runeModel.find(filter).lean().exec();
    if (db.length > 0) return db;

    // Fallback to shared constant so UI always works
    let all = ELDER_FUTHARK;
    if (aett) all = all.filter((r) => r.aett === aett);
    if (q) {
      const rx = new RegExp(q, "i");
      all = all.filter(
        (r) =>
          rx.test(r.key) ||
          rx.test(r.name) ||
          rx.test(r.phonetic) ||
          rx.test(r.notes) ||
          r.meaning.some((m) => rx.test(m))
      );
    }
    return all;
  }
}