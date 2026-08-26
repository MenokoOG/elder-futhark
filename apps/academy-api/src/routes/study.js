import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { StudyItem } from "../models/StudyItem.js";
import { Progress } from "../models/Progress.js";
import { gradeSM2 } from "../utils/sm2.js";

export const studyRouter = express.Router();

studyRouter.get("/due", requireAuth, async (req, res) => {
  const userId = req.user.sub;
  const now = new Date();
  const items = await StudyItem.find({ userId, dueAt: { $lte: now } }).sort({ dueAt: 1 }).limit(50).lean();
  return res.json({ items });
});

studyRouter.post("/rate", requireAuth, async (req, res) => {
  const userId = req.user.sub;
  const runeKey = String(req.body?.runeKey || "");
  const quality = Number(req.body?.quality);

  if (!runeKey) return res.status(400).json({ message: "runeKey required" });
  if (!Number.isFinite(quality) || quality < 0 || quality > 5) return res.status(400).json({ message: "quality must be 0..5" });

  let item = await StudyItem.findOne({ userId, runeKey });
  if (!item) item = await StudyItem.create({ userId, runeKey, dueAt: new Date() });

  const next = gradeSM2({
    quality,
    repetitions: item.repetitions,
    intervalDays: item.intervalDays,
    easeFactor: item.easeFactor,
    lapses: item.lapses
  });

  const dueAt = new Date();
  dueAt.setDate(dueAt.getDate() + next.intervalDays);

  item.repetitions = next.repetitions;
  item.intervalDays = next.intervalDays;
  item.easeFactor = next.easeFactor;
  item.lapses = next.lapses;
  item.dueAt = dueAt;
  await item.save();

  await Progress.updateOne({ userId }, { $inc: { totalStudyReviews: 1 } }, { upsert: true });

  return res.json({ item });
});
