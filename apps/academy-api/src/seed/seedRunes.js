require("dotenv").config();
const { connectDb } = require("../db");
const mongoose = require("mongoose");
const { ELDER_FUTHARK } = require("../shared/runes/elderFuthark");

async function main() {
  await connectDb();

  // optional: store in db later; MVP serves from static list.
  console.log(`✅ Loaded ${ELDER_FUTHARK.length} runes (static). Nothing to seed in DB right now.`);
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});