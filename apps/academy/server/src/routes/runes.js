import express from "express";
import { ELDER_FUTHARK } from "../data/elderFuthark.js";

export const runesRouter = express.Router();

runesRouter.get("/", (req, res) => {
  const q = String(req.query.q || "").trim().toLowerCase();
  const aett = req.query.aett ? Number(req.query.aett) : null;

  let items = ELDER_FUTHARK;

  if (aett && Number.isFinite(aett)) {
    items = items.filter((r) => Number(r.aett) === aett);
  }

  if (q) {
    items = items.filter((r) => {
      const meaningParts = Array.isArray(r.meaning) ? r.meaning : [r.meaning].filter(Boolean);
      const haystack = (r.name + " " + r.key + " " + r.phonetic + " " + meaningParts.join(" ")).toLowerCase();
      return haystack.includes(q);
    });
  }

  return res.json({ items });
});
