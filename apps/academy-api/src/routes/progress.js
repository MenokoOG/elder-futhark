import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { Progress } from "../models/Progress.js";

export const progressRouter = express.Router();

progressRouter.get("/me", requireAuth, async (req, res) => {
  const userId = req.user.sub;
  const p = await Progress.findOne({ userId }).lean();
  return res.json({ progress: p || { userId } });
});
