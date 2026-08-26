import mongoose from "mongoose";

const RuneSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    glyph: { type: String, required: true },
    name: { type: String, required: true },
    phonetic: { type: String, required: true },
    meaning: { type: [String], required: true },
    aett: { type: Number, required: true },
    notes: { type: String, default: "" }
  },
  { versionKey: false }
);

export const Rune = mongoose.model("Rune", RuneSchema);
