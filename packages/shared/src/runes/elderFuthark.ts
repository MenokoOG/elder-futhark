export type Aett = 1 | 2 | 3;

export type Rune = {
  key: string;        // stable id, e.g. "fehu"
  glyph: string;      // rune character
  name: string;       // display name
  phonetic: string;   // "F", "U", etc
  meaning: string[];  // keywords
  aett: Aett;         // 1..3
  notes: string;      // short lore
};

export const ELDER_FUTHARK: Rune[] = [
  {
    key: "fehu",
    glyph: "ᚠ",
    name: "Fehu",
    phonetic: "F",
    meaning: ["wealth", "cattle", "prosperity", "motion"],
    aett: 1,
    notes: "Wealth that moves—resources, flow, and the responsibility of possession."
  },
  {
    key: "uruz",
    glyph: "ᚢ",
    name: "Uruz",
    phonetic: "U",
    meaning: ["strength", "vitality", "raw power", "endurance"],
    aett: 1,
    notes: "The aurochs—untamed force and the shaping of power through will."
  },
  {
    key: "thurisaz",
    glyph: "ᚦ",
    name: "Thurisaz",
    phonetic: "TH",
    meaning: ["thorn", "defense", "challenge", "boundary"],
    aett: 1,
    notes: "The thorn—protective pain; a gate that tests what passes through."
  },
  {
    key: "ansuz",
    glyph: "ᚨ",
    name: "Ansuz",
    phonetic: "A",
    meaning: ["communication", "insight", "breath", "signal"],
    aett: 1,
    notes: "Breath and message—speech, omen, and the clarity of a true signal."
  },
  {
    key: "raidho",
    glyph: "ᚱ",
    name: "Raidho",
    phonetic: "R",
    meaning: ["journey", "rhythm", "order", "alignment"],
    aett: 1,
    notes: "Right movement—travel, cycles, and decisions in motion."
  },
  {
    key: "kenaz",
    glyph: "ᚲ",
    name: "Kenaz",
    phonetic: "K",
    meaning: ["torch", "revelation", "craft", "illumination"],
    aett: 1,
    notes: "The torch—knowledge revealed and the heat of skilled creation."
  },
  {
    key: "gebo",
    glyph: "ᚷ",
    name: "Gebo",
    phonetic: "G",
    meaning: ["gift", "exchange", "balance", "bond"],
    aett: 1,
    notes: "Gift and counter-gift—relationships built through reciprocity."
  },
  {
    key: "wunjo",
    glyph: "ᚹ",
    name: "Wunjo",
    phonetic: "W",
    meaning: ["joy", "harmony", "belonging", "comfort"],
    aett: 1,
    notes: "Joy in alignment—shared success and the warmth of community."
  },

  {
    key: "hagalaz",
    glyph: "ᚺ",
    name: "Hagalaz",
    phonetic: "H",
    meaning: ["hail", "disruption", "reset", "nature"],
    aett: 2,
    notes: "Hailstorm—sudden change that breaks stale patterns."
  },
  {
    key: "nauthiz",
    glyph: "ᚾ",
    name: "Nauthiz",
    phonetic: "N",
    meaning: ["need", "constraint", "friction", "focus"],
    aett: 2,
    notes: "Need-fire—pressure that sharpens intention."
  },
  {
    key: "isa",
    glyph: "ᛁ",
    name: "Isa",
    phonetic: "I",
    meaning: ["ice", "stillness", "pause", "clarity"],
    aett: 2,
    notes: "Ice—hold position; observe what is true without motion."
  },
  {
    key: "jera",
    glyph: "ᛃ",
    name: "Jera",
    phonetic: "Y/J",
    meaning: ["harvest", "cycle", "earned reward", "time"],
    aett: 2,
    notes: "Year-turn—outcomes of consistency, revealed on schedule."
  },
  {
    key: "eihwaz",
    glyph: "ᛇ",
    name: "Eihwaz",
    phonetic: "EI",
    meaning: ["yew", "resilience", "axis", "endurance"],
    aett: 2,
    notes: "Yew—stamina and the spine of long-term transformation."
  },
  {
    key: "perthro",
    glyph: "ᛈ",
    name: "Perthro",
    phonetic: "P",
    meaning: ["mystery", "chance", "secret", "lot"],
    aett: 2,
    notes: "Cup of lots—unknown variables, probability, and hidden structure."
  },
  {
    key: "algiz",
    glyph: "ᛉ",
    name: "Algiz",
    phonetic: "Z/R",
    meaning: ["protection", "ward", "instinct", "sanctuary"],
    aett: 2,
    notes: "Elk-sedge—defense through awareness and posture."
  },
  {
    key: "sowilo",
    glyph: "ᛋ",
    name: "Sowilo",
    phonetic: "S",
    meaning: ["sun", "victory", "wholeness", "success"],
    aett: 2,
    notes: "Sun—coherence, vitality, and direction made bright."
  },

  {
    key: "tiwaz",
    glyph: "ᛏ",
    name: "Tiwaz",
    phonetic: "T",
    meaning: ["justice", "courage", "honor", "sacrifice"],
    aett: 3,
    notes: "Tyr—right action even when it costs you."
  },
  {
    key: "berkano",
    glyph: "ᛒ",
    name: "Berkano",
    phonetic: "B",
    meaning: ["growth", "birth", "renewal", "care"],
    aett: 3,
    notes: "Birch—nurturing growth and protective beginnings."
  },
  {
    key: "ehwaz",
    glyph: "ᛖ",
    name: "Ehwaz",
    phonetic: "E",
    meaning: ["trust", "partnership", "movement", "teamwork"],
    aett: 3,
    notes: "Horse—coordinated motion and mutual reliability."
  },
  {
    key: "mannaz",
    glyph: "ᛗ",
    name: "Mannaz",
    phonetic: "M",
    meaning: ["human", "mind", "community", "self"],
    aett: 3,
    notes: "Human—identity shaped by the collective."
  },
  {
    key: "laguz",
    glyph: "ᛚ",
    name: "Laguz",
    phonetic: "L",
    meaning: ["water", "intuition", "flow", "depth"],
    aett: 3,
    notes: "Water—adaptation, feeling, and the intelligence of currents."
  },
  {
    key: "ingwaz",
    glyph: "ᛜ",
    name: "Ingwaz",
    phonetic: "NG",
    meaning: ["seed", "potential", "containment", "gestation"],
    aett: 3,
    notes: "Seed—power stored, then released at the right time."
  },
  {
    key: "dagaz",
    glyph: "ᛞ",
    name: "Dagaz",
    phonetic: "D",
    meaning: ["daybreak", "breakthrough", "clarity", "shift"],
    aett: 3,
    notes: "Dawn—transformative clarity and the flip to a new state."
  },
  {
    key: "othala",
    glyph: "ᛟ",
    name: "Othala",
    phonetic: "O",
    meaning: ["heritage", "home", "legacy", "inheritance"],
    aett: 3,
    notes: "Home/ancestral land—legacy, belonging, and what you pass forward."
  }
];