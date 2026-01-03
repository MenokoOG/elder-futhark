import { ELDER_FUTHARK } from "../runes/elderFuthark";

export type TransliterationMode =
  | "phonetic"
  | "simple-substitution"
  | "reverse"
  | "atbash";

export type TransliterationResult = {
  input: string;
  mode: TransliterationMode;
  outputRunes: string;
  outputKeys: string[];
};

const KEY_BY_LATIN: Record<string, string> = {
  // rough phonetic mapping
  a: "ansuz",
  b: "berkano",
  c: "kenaz",
  k: "kenaz",
  d: "dagaz",
  e: "ehwaz",
  f: "fehu",
  g: "gebo",
  h: "hagalaz",
  i: "isa",
  j: "jera",
  y: "jera",
  l: "laguz",
  m: "mannaz",
  n: "nauthiz",
  o: "othala",
  p: "perthro",
  r: "raidho",
  s: "sowilo",
  t: "tiwaz",
  u: "uruz",
  w: "wunjo",
  z: "algiz",
  x: "algiz",
  ng: "ingwaz",
  th: "thurisaz",
  ei: "eihwaz"
};

const RUNE = (key: string) => ELDER_FUTHARK.find(r => r.key === key);
const ALL_KEYS = ELDER_FUTHARK.map(r => r.key);

function normalizeText(input: string) {
  return input.toLowerCase().replace(/[^a-z\s]/g, "");
}

function tokenize(input: string) {
  // prefer multi-char phonemes first
  const s = normalizeText(input);
  const out: string[] = [];
  let i = 0;
  while (i < s.length) {
    const ch = s[i]!;
    if (ch === " ") {
      out.push(" ");
      i++;
      continue;
    }
    const two = s.slice(i, i + 2);
    if (two === "th") { out.push("th"); i += 2; continue; }
    if (two === "ng") { out.push("ng"); i += 2; continue; }
    if (two === "ei") { out.push("ei"); i += 2; continue; }
    out.push(ch);
    i++;
  }
  return out;
}

export function transliterate(input: string, mode: TransliterationMode): TransliterationResult {
  const tokens = tokenize(input);

  if (mode === "phonetic") {
    const keys: string[] = [];
    for (const t of tokens) {
      if (t === " ") { keys.push(" "); continue; }
      const k = KEY_BY_LATIN[t];
      keys.push(k ?? "isa"); // fallback: Isa (neutral)
    }
    const outputKeys = keys.filter(k => k !== " ");
    const outputRunes = keys.map(k => k === " " ? " " : (RUNE(k)?.glyph ?? "ᛁ")).join("");
    return { input, mode, outputRunes, outputKeys };
  }

  // Build alphabet for substitution over rune keys (24)
  const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
  const usable = ALL_KEYS.slice(0, 24);

  const mapIndex: Record<string, number> = {};
  alphabet.slice(0, 24).forEach((c, idx) => { mapIndex[c] = idx; });

  const transformIndex = (idx: number) => {
    if (mode === "reverse") return 23 - idx;
    if (mode === "atbash") return 23 - idx;
    return idx; // simple-substitution
  };

  const keys: string[] = [];
  for (const t of tokens) {
    if (t === " ") { keys.push(" "); continue; }
    const c = t[0]!;
    const idx = mapIndex[c];
    if (idx === undefined) {
      keys.push("isa");
      continue;
    }
    const mapped = usable[transformIndex(idx)]!;
    keys.push(mapped);
  }

  const outputKeys = keys.filter(k => k !== " ");
  const outputRunes = keys.map(k => k === " " ? " " : (RUNE(k)?.glyph ?? "ᛁ")).join("");
  return { input, mode, outputRunes, outputKeys };
}