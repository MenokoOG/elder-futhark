import express from "express";
import morgan from "morgan";
import cors from "cors";

import { assertEnv, env } from "./config/env.js";
import { connectDb } from "./db.js";

import { authRouter } from "./routes/auth.js";
import { runesRouter } from "./routes/runes.js";
import { loreRouter } from "./routes/lore.js";
import { ritualRouter } from "./routes/ritual.js";
import { progressRouter } from "./routes/progress.js";
import { studyRouter } from "./routes/study.js";
import { statsRouter } from "./routes/stats.js";

function buildCors() {
  if (!env.CLIENT_ORIGIN.length) return cors();
  return cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true);
      if (env.CLIENT_ORIGIN.includes(origin)) return cb(null, true);
      return cb(new Error("CORS blocked"), false);
    }
  });
}

async function main() {
  assertEnv();
  await connectDb();

  const app = express();

  // Prevent conditional GETs (ETag/If-None-Match) for API JSON responses
  app.set("etag", false);

  // Prevent browser caching for API responses (so you always get a 200 + body)
  app.use("/api", (_req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
  });

  app.use(buildCors());
  app.use(express.json({ limit: "4mb" }));
  app.use(morgan("dev"));

  app.get("/api/health", (_req, res) => res.json({ ok: true }));

  app.use("/api/auth", authRouter);
  app.use("/api/runes", runesRouter);
  app.use("/api/lore", loreRouter);
  app.use("/api/ritual", ritualRouter);
  app.use("/api/progress", progressRouter);
  app.use("/api/study", studyRouter);
  app.use("/api/stats", statsRouter);

  app.use((_req, res) => res.status(404).json({ error: "Not Found" }));

  app.use((err, _req, res, _next) => {
    console.error("[server error]", err);
    res.status(500).json({ message: "Server error" });
  });

  app.listen(env.PORT, () => console.log(`[server] listening on :${env.PORT}`));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
