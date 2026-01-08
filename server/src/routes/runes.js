import express from "express";
import { Rune } from "../models/Rune.js";

export const runesRouter = express.Router();

runesRouter.get("/", async (req, res) => {
  const q = String(req.query.q || "").trim().toLowerCase();
  const aett = req.query.aett ? Number(req.query.aett) : null;

  const filter = {};
  if (aett && Number.isFinite(aett)) filter.aett = aett;

  if (q) {
    filter.$or = [
      { key: { $regex: q, $options: "i" } },
      { name: { $regex: q, $options: "i" } },
      { phonetic: { $regex: q, $options: "i" } },
      { meaning: { $elemMatch: { $regex: q, $options: "i" } } }
    ];
  }

  const runes = await Rune.find(filter).sort({ aett: 1, key: 1 }).lean();
  return res.json({ items: runes });
});
