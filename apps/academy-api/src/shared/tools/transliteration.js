const { ELDER_FUTHARK } = require("../runes/elderFuthark");

const runeByKey = new Map(ELDER_FUTHARK.map((r) => [r.key, r]));
const runeByGlyph = new Map(ELDER_FUTHARK.map((r) => [r.glyph, r]));

function toRunes(text) {
  const t = String(text || "").toLowerCase();
  let out = "";
  for (let i = 0; i < t.length; i++) {
    const ch = t[i];
    if (ch === " ") { out += " "; continue; }
    const match = ELDER_FUTHARK.find((r) => r.phonetic === ch);
    out += match ? match.glyph : ch;
  }
  return out;
}

function toLatin(text) {
  const t = String(text || "");
  let out = "";
  for (const ch of t) {
    if (ch === " ") { out += " "; continue; }
    const r = runeByGlyph.get(ch);
    out += r ? r.phonetic : ch;
  }
  return out;
}

module.exports = { toRunes, toLatin, runeByKey, runeByGlyph };