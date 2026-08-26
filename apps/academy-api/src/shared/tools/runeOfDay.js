const { ELDER_FUTHARK } = require("../runes/elderFuthark");
const { hashStringToInt } = require("./hash");

function isoDateUTC(d = new Date()) {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function runeOfDayKey(isoDate) {
  const idx = hashStringToInt(`efa:${isoDate}`) % ELDER_FUTHARK.length;
  return ELDER_FUTHARK[idx].key;
}

module.exports = { isoDateUTC, runeOfDayKey };