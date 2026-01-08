import mongoose from "mongoose";

const StudyItemSchema = new mongoose.Schema(
  {
    userId: { type: String, index: true, required: true },
    runeKey: { type: String, index: true, required: true },

    repetitions: { type: Number, default: 0 },
    intervalDays: { type: Number, default: 0 },
    easeFactor: { type: Number, default: 2.5 },
    dueAt: { type: Date, required: true },

    lapses: { type: Number, default: 0 }
  },
  { versionKey: false }
);

StudyItemSchema.index({ userId: 1, runeKey: 1 }, { unique: true });

export const StudyItem = mongoose.model("StudyItem", StudyItemSchema);
