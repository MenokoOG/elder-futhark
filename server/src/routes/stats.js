import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { Progress } from "../models/Progress.js";
import { StudyItem } from "../models/StudyItem.js";

export const statsRouter = express.Router();

statsRouter.get("/me", requireAuth, async (req, res) => {
  const userId = req.user.sub;
  const [p, totalItems] = await Promise.all([
    Progress.findOne({ userId }).lean(),
    StudyItem.countDocuments({ userId })
  ]);

  return res.json({
    overview: {
      totalStudyReviews: p?.totalStudyReviews || 0,
      ritualStreak: p?.ritualStreak || 0,
      totalStudyItems: totalItems
    }
  });
});
