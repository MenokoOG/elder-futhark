import "dotenv/config";
import mongoose from "mongoose";

import { connectDb } from "../db.js";
import { ELDER_FUTHARK } from "../data/elderFuthark.js";

async function main() {
  await connectDb();

  // The MVP serves runes from the static list in src/data/elderFuthark.js;
  // nothing is persisted yet. This remains a connectivity check until the
  // rune collection actually exists.
  console.log(`✅ Loaded ${ELDER_FUTHARK.length} runes (static). Nothing to seed in DB right now.`);

  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
