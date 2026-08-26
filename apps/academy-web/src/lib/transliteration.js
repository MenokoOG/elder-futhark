import { ELDER_FUTHARK } from "./elderFuthark";

const keyToGlyph = new Map(ELDER_FUTHARK.map(r => [r.key, r.glyph]));

/**
 * A pragmatic transliteration mapping:
 * - We try multi-char matches first (TH, NG, EI)
 * - Then single letters
 *
 * This is not a full linguistic reconstruction; it’s a learning tool.
 */
const DIGRAPHS = [
  { latin: "TH", key: "thurisaz" },
  { latin: "NG", key: "ingwaz" },
  { latin: "EI", key: "eihwaz" },
  { latin: "AE", key: "ansuz" }, // soft fallback
];

const SINGLE = {
  F: "fehu",
  U: "uruz",
  A: "ansuz",
  R: "raidho",
  K: "kenaz",
  C: "kenaz",
  G: "gebo",
  W: "wunjo",
  H: "hagalaz",
  N: "nauthiz",
  I: "isa",
  J: "jera",
  Y: "jera",
  P: "perthro",
  Z: "algiz",
  S: "sowilo",
  T: "tiwaz",
  B: "berkano",
  E: "ehwaz",
  M: "mannaz",
  L: "laguz",
  D: "dagaz",
  O: "othala"
};

export function latinToRunes(text) {
  const src = String(text || "");
  const up = src.toUpperCase();
  let i = 0;
  const out = [];
  const map = [];

  while (i < up.length) {
    const ch = up[i];

    if (ch === " " || ch === "\n" || ch === "\t") {
      out.push(" ");
      map.push({ type: "space", at: i });
      i += 1;
      continue;
    }

    let matched = null;
    for (const d of DIGRAPHS) {
      if (up.slice(i, i + d.latin.length) === d.latin) {
        matched = d;
        break;
      }
    }

    if (matched) {
      const glyph = keyToGlyph.get(matched.key) || "?";
      out.push(glyph);
      map.push({ type: "rune", key: matched.key, latin: matched.latin, at: i });
      i += matched.latin.length;
      continue;
    }

    const key = SINGLE[ch];
    if (key) {
      out.push(keyToGlyph.get(key));
      map.push({ type: "rune", key, latin: ch, at: i });
    } else {
      out.push(ch); // keep punctuation
      map.push({ type: "raw", value: ch, at: i });
    }
    i += 1;
  }

  return { runes: out.join(""), map };
}

export function runesToLatin(text) {
  const src = String(text || "");
  const glyphToRune = new Map(ELDER_FUTHARK.map(r => [r.glyph, r]));

  const out = [];
  for (const ch of src) {
    if (ch === " ") { out.push(" "); continue; }
    const r = glyphToRune.get(ch);
    if (!r) { out.push(ch); continue; }
    out.push(r.phonetic);
  }
  return out.join("");
}
