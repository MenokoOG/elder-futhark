import "reflect-metadata";
import mongoose from "mongoose";
import { ELDER_FUTHARK, RuneSchema as RuneZodSchema } from "@efa/shared";
import { z } from "zod";

const RuneModelSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, index: true, required: true },
    glyph: { type: String, required: true },
    name: { type: String, required: true },
    phonetic: { type: String, required: true },
    meaning: { type: [String], required: true },
    aett: { type: Number, required: true },
    notes: { type: String, required: true }
  },
  { timestamps: true }
);

const RuneModel = mongoose.model("Rune", RuneModelSchema);

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI missing");

  await mongoose.connect(uri);

  const validated = z.array(RuneZodSchema).parse(ELDER_FUTHARK);

  for (const r of validated) {
    await RuneModel.updateOne({ key: r.key }, { $set: r }, { upsert: true });
  }

  // eslint-disable-next-line no-console
  console.log(`Seeded ${validated.length} runes ✅`);

  await mongoose.disconnect();
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});