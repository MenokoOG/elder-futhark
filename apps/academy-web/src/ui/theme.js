// Per-page topic accents. Every value is a step from the Organic ramps.
export const PAGE_THEME = {
  "/":                 { kicker: "Elder Futhark Academy", title: "Learn the row by sound, shape and meaning", blurb: "Twenty-four runes, three aetts. Decks, quizzes, a daily rite and a spaced study queue.", rune: "fehu",     accent: "#d67f48", tint: "#ffe1d0", deep: "#8c491a" },
  "/runes":            { kicker: "The row",        title: "Rune index",             blurb: "All twenty-four, with sound, meaning and the aett each one belongs to.",            rune: "raidho",   accent: "#645c50", tint: "#eee7db", deep: "#474238" },
  "/flashcards":       { kicker: "Decks",          title: "Flip, recall, rate",     blurb: "One card at a time. Guess the rune, flip it, then rate how close you were.",        rune: "jera",     accent: "#8fa073", tint: "#e1eecc", deep: "#56633f" },
  "/study":            { kicker: "Spaced review",  title: "Study queue",            blurb: "Whatever is due today, in the order it came due.",                                  rune: "isa",      accent: "#728157", tint: "#f0fae1", deep: "#3d472b" },
  "/quiz":             { kicker: "Test",           title: "Quiz",                   blurb: "Glyph to name, name to glyph, meaning to rune. Eighty percent is the bar.",         rune: "tiwaz",    accent: "#b2622d", tint: "#ffe1d0", deep: "#8c491a" },
  "/tools/canvas":     { kicker: "Hand",           title: "Drawing lab",            blurb: "Trace the target rune and let the recognizer score your stroke.",                   rune: "kenaz",    accent: "#474238", tint: "#f9f4ed", deep: "#2e2b25" },
  "/tools/orb":        { kicker: "Focus",          title: "Rune orb",               blurb: "One rune, one sphere. Drag it around until the shape sticks.",                      rune: "ingwaz",   accent: "#728157", tint: "#f0fae1", deep: "#3d472b" },
  "/tools/transliterate": { kicker: "Writing",     title: "Transliteration lab",    blurb: "Latin in, runes out — and back the other way.",                                     rune: "laguz",    accent: "#8c491a", tint: "#fff2eb", deep: "#643312" },
  "/ritual":           { kicker: "Daily rite",     title: "Rune of the day",        blurb: "One rune, once a day. Claim it to keep the streak alive.",                          rune: "sowilo",   accent: "#b2622d", tint: "#ffe1d0", deep: "#643312" },
  "/stones":           { kicker: "Casting",        title: "Rune stones",            blurb: "Cast a stone, carve a rune, keep the one that feels right.",                        rune: "perthro",  accent: "#82796a", tint: "#eee7db", deep: "#474238" },
  "/lore":             { kicker: "Context",        title: "Lore",                   blurb: "Short lessons so the runes sit inside something larger than a list.",               rune: "dagaz",    accent: "#728157", tint: "#e1eecc", deep: "#3d472b" },
  "/gods":             { kicker: "Figures",        title: "Gods & figures",         blurb: "The names that turn up across the lore and the correspondences.",                    rune: "ansuz",    accent: "#645c50", tint: "#eee7db", deep: "#2e2b25" },
  "/progress":         { kicker: "Your path",      title: "Progress",               blurb: "A light profile of where you are in the row.",                                      rune: "berkano",  accent: "#8fa073", tint: "#e1eecc", deep: "#56633f" },
  "/stats":            { kicker: "Numbers",        title: "Stats",                  blurb: "Numbers are not the point. Momentum is.",                                          rune: "wunjo",    accent: "#d67f48", tint: "#fff2eb", deep: "#8c491a" },
  "/signin":           { kicker: "Gebo · exchange", title: "Sign in",               blurb: "An account keeps your ritual streak, study queue and numbers.",                     rune: "gebo",     accent: "#b2622d", tint: "#ffe1d0", deep: "#8c491a" },
};

export const FALLBACK_THEME = { kicker: "Not found", title: "Nothing here", blurb: "That page doesn't exist.", rune: "hagalaz", accent: "#82796a", tint: "#eee7db", deep: "#474238" };

export function themeFor(pathname) {
  return PAGE_THEME[pathname] || FALLBACK_THEME;
}

export const NAV_GROUPS = [
  { label: "Learn", items: [
    { to: "/runes", label: "Runes", glyph: "ᚱ" },
    { to: "/flashcards", label: "Decks", glyph: "ᛃ" },
    { to: "/study", label: "Study", glyph: "ᛁ", gated: true },
    { to: "/quiz", label: "Quiz", glyph: "ᛏ" },
  ]},
  { label: "Practice", items: [
    { to: "/tools/canvas", label: "Draw", glyph: "ᚲ" },
    { to: "/tools/orb", label: "Orb", glyph: "ᛜ" },
    { to: "/tools/transliterate", label: "Transliterate", glyph: "ᛚ" },
  ]},
  { label: "Rite", items: [
    { to: "/ritual", label: "Daily ritual", glyph: "ᛋ", gated: true },
    { to: "/stones", label: "Stones", glyph: "ᛈ" },
  ]},
  { label: "Lore", items: [
    { to: "/lore", label: "Lore", glyph: "ᛞ" },
    { to: "/gods", label: "Gods & figures", glyph: "ᚨ" },
  ]},
  { label: "You", items: [
    { to: "/progress", label: "Progress", glyph: "ᛒ", gated: true },
    { to: "/stats", label: "Stats", glyph: "ᚹ", gated: true },
  ]},
];

export const AETT_INK = ["#b2622d", "#728157", "#645c50"];
