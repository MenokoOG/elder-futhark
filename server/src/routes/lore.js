import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const loreRouter = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, "../data");

function readJson(fileName, fallback) {
  try {
    const fullPath = path.join(DATA_DIR, fileName);
    const raw = fs.readFileSync(fullPath, "utf8");
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

const LESSONS = readJson("lore_lessons.json", []);
const GODS = readJson("gods.json", []);
const SOURCES = readJson("sources.json", []);
const RUNE_CORRESPONDENCES = readJson("rune_correspondences.json", []);
const RUNE_LORE = readJson("rune_lore.json", {});

loreRouter.get("/", (_req, res) => res.json({ items: LESSONS }));

loreRouter.get("/gods", (req, res) => {
  const q = String(req.query.q || "")
    .trim()
    .toLowerCase();
  if (!q) return res.json({ items: GODS });

  const items = GODS.filter((x) => {
    const domains = Array.isArray(x.domains) ? x.domains.join(" ") : "";
    const functions = Array.isArray(x.functions) ? x.functions.join(" ") : "";
    const haystack =
      `${x.name || ""} ${x.key || ""} ${x.group || ""} ${domains} ${functions}`.toLowerCase();
    return haystack.includes(q);
  });

  return res.json({ items });
});

loreRouter.get("/sources", (_req, res) => res.json({ items: SOURCES }));
loreRouter.get("/correspondences", (_req, res) =>
  res.json({ items: RUNE_CORRESPONDENCES }),
);
loreRouter.get("/rune-lore", (_req, res) => res.json({ items: RUNE_LORE }));

loreRouter.get("/bundle", (_req, res) => {
  return res.json({
    lessons: LESSONS,
    gods: GODS,
    sources: SOURCES,
    correspondences: RUNE_CORRESPONDENCES,
    runeLore: RUNE_LORE,
  });
});
