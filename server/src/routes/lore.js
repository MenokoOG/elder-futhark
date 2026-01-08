import express from "express";

export const loreRouter = express.Router();

const LESSONS = [
  { key: "intro", title: "Welcome", body: "Runes are letters and symbols. We'll learn them by sound, shape, and meaning." },
  { key: "aetts", title: "The Aetts", body: "Elder Futhark is often taught in three groups called aetts. We’ll use them for pacing." },
  { key: "practice", title: "Practice", body: "Short sessions, frequent review. Accuracy first, speed later." }
];

loreRouter.get("/", async (_req, res) => res.json({ items: LESSONS }));
