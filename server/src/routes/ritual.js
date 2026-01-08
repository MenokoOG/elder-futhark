import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { Progress } from "../models/Progress.js";
import { isoDay, addDaysISO } from "../utils/date.js";
import { runeOfDayKey } from "../utils/runeOfDay.js";

export const ritualRouter = express.Router();

async function ensureProgress(userId) {
  let p = await Progress.findOne({ userId });
  if (!p) p = await Progress.create({ userId });
  return p;
}

ritualRouter.get("/rune-of-day", requireAuth, async (req, res) => {
  const userId = req.user.sub;
  const today = isoDay();
  const key = runeOfDayKey(today);
  const p = await ensureProgress(userId);
  return res.json({
    isoDate: today,
    runeKey: key,
    streak: p.ritualStreak || 0,
    claimedToday: p.ritualDate === today
  });
});

ritualRouter.post("/claim", requireAuth, async (req, res) => {
  const userId = req.user.sub;
  const today = isoDay();
  const key = runeOfDayKey(today);

  const p = await ensureProgress(userId);

  if (p.ritualDate === today) {
    return res.json({ isoDate: today, runeKey: key, streak: p.ritualStreak || 0, claimedToday: true });
  }

  const yesterday = addDaysISO(today, -1);
  const nextStreak = p.ritualDate === yesterday ? (p.ritualStreak || 0) + 1 : 1;

  p.ritualDate = today;
  p.lastRuneKey = key;
  p.ritualStreak = nextStreak;
  await p.save();

  return res.json({ isoDate: today, runeKey: key, streak: nextStreak, claimedToday: true });
});
