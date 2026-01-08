const ELDER_FUTHARK = [
  { key: "fehu", glyph: "ᚠ", name: "Fehu", phonetic: "f", aett: 1, meaning: ["cattle", "wealth"], notes: "Wealth, movable property." },
  { key: "uruz", glyph: "ᚢ", name: "Uruz", phonetic: "u", aett: 1, meaning: ["aurochs", "strength"], notes: "Vitality, endurance." },
  { key: "thurisaz", glyph: "ᚦ", name: "Thurisaz", phonetic: "th", aett: 1, meaning: ["giant", "thorn"], notes: "Defense, reactive force." },
  { key: "ansuz", glyph: "ᚨ", name: "Ansuz", phonetic: "a", aett: 1, meaning: ["god", "speech"], notes: "Communication, wisdom." },
  { key: "raidho", glyph: "ᚱ", name: "Raidho", phonetic: "r", aett: 1, meaning: ["ride", "journey"], notes: "Travel, rhythm, right order." },
  { key: "kenaz", glyph: "ᚲ", name: "Kenaz", phonetic: "k", aett: 1, meaning: ["torch", "knowledge"], notes: "Insight, craft." },
  { key: "gebo", glyph: "ᚷ", name: "Gebo", phonetic: "g", aett: 1, meaning: ["gift", "exchange"], notes: "Balance, reciprocity." },
  { key: "wunjo", glyph: "ᚹ", name: "Wunjo", phonetic: "w", aett: 1, meaning: ["joy", "harmony"], notes: "Comfort, fellowship." },

  { key: "hagalaz", glyph: "ᚺ", name: "Hagalaz", phonetic: "h", aett: 2, meaning: ["hail"], notes: "Disruption, transformation." },
  { key: "nauthiz", glyph: "ᚾ", name: "Nauthiz", phonetic: "n", aett: 2, meaning: ["need", "constraint"], notes: "Necessity, endurance." },
  { key: "isa", glyph: "ᛁ", name: "Isa", phonetic: "i", aett: 2, meaning: ["ice"], notes: "Stillness, focus." },
  { key: "jera", glyph: "ᛃ", name: "Jera", phonetic: "j", aett: 2, meaning: ["year", "harvest"], notes: "Cycles, reward." },
  { key: "eihwaz", glyph: "ᛇ", name: "Eihwaz", phonetic: "ei", aett: 2, meaning: ["yew", "axis"], notes: "Resilience, connection." },
  { key: "perthro", glyph: "ᛈ", name: "Perthro", phonetic: "p", aett: 2, meaning: ["lot-cup", "chance"], notes: "Mystery, fate." },
  { key: "algiz", glyph: "ᛉ", name: "Algiz", phonetic: "z", aett: 2, meaning: ["elk", "protection"], notes: "Shielding, guardianship." },
  { key: "sowilo", glyph: "ᛋ", name: "Sowilo", phonetic: "s", aett: 2, meaning: ["sun"], notes: "Success, clarity." },

  { key: "tiwaz", glyph: "ᛏ", name: "Tiwaz", phonetic: "t", aett: 3, meaning: ["Tyr", "justice"], notes: "Honor, right action." },
  { key: "berkano", glyph: "ᛒ", name: "Berkano", phonetic: "b", aett: 3, meaning: ["birch", "growth"], notes: "Renewal, nurture." },
  { key: "ehwaz", glyph: "ᛖ", name: "Ehwaz", phonetic: "e", aett: 3, meaning: ["horse", "trust"], notes: "Partnership, movement." },
  { key: "mannaz", glyph: "ᛗ", name: "Mannaz", phonetic: "m", aett: 3, meaning: ["humanity"], notes: "Self, community." },
  { key: "laguz", glyph: "ᛚ", name: "Laguz", phonetic: "l", aett: 3, meaning: ["water", "flow"], notes: "Intuition, adaptation." },
  { key: "ingwaz", glyph: "ᛜ", name: "Ingwaz", phonetic: "ng", aett: 3, meaning: ["Ing", "seed"], notes: "Potential, containment." },
  { key: "dagaz", glyph: "ᛞ", name: "Dagaz", phonetic: "d", aett: 3, meaning: ["day", "breakthrough"], notes: "Awakening, change." },
  { key: "othala", glyph: "ᛟ", name: "Othala", phonetic: "o", aett: 3, meaning: ["heritage", "home"], notes: "Ancestry, belonging." }
];

module.exports = { ELDER_FUTHARK };