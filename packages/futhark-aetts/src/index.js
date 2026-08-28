/**
 * The three aettir ("families") of the Elder Futhark.
 *
 * Provenance matters here, and the two kinds of claim are kept separate:
 *
 *   - `name`, `alsoKnownAs` and `runeKeys` are TRADITIONAL. The division of the
 *     twenty-four runes into three groups of eight is attested in the historical
 *     rune-row orderings, and the group names follow long-standing convention.
 *   - `theme` and `focus` are MODERN INTERPRETATION. They are a teaching frame,
 *     not an attested historical claim about what the aettir meant to their
 *     users. Anything rendering these must not present them as historical fact.
 *
 * See `provenance` on each entry, and PROVENANCE below.
 */

/** How each field on an aett should be treated. */
export const PROVENANCE = Object.freeze({
  name: 'traditional',
  alsoKnownAs: 'traditional',
  runeKeys: 'traditional',
  theme: 'modern_interpretation',
  focus: 'modern_interpretation'
});

export const AETTS = Object.freeze([
  Object.freeze({
    number: 1,
    key: 'freyr',
    name: "Freyr's Aett",
    alsoKnownAs: Object.freeze(["Freyja's Aett"]),
    theme: 'Creation and Wealth',
    focus: 'Physical life, primal energy, growth, and material or personal wealth.',
    runeKeys: Object.freeze(['fehu', 'uruz', 'thurisaz', 'ansuz', 'raidho', 'kenaz', 'gebo', 'wunjo'])
  }),
  Object.freeze({
    number: 2,
    key: 'hagal',
    name: "Hagal's Aett",
    alsoKnownAs: Object.freeze(["Heimdall's Aett"]),
    theme: 'Change and Trial',
    focus: 'Forces outside our control, tests, trials, and deep personal transformation.',
    runeKeys: Object.freeze(['hagalaz', 'nauthiz', 'isa', 'jera', 'eihwaz', 'perthro', 'algiz', 'sowilo'])
  }),
  Object.freeze({
    number: 3,
    key: 'tyr',
    name: "Tyr's Aett",
    alsoKnownAs: Object.freeze([]),
    theme: 'Order and Spirit',
    focus: 'Human nature, society, justice, breakthrough, the divine, and achievements of the mind.',
    runeKeys: Object.freeze(['tiwaz', 'berkano', 'ehwaz', 'mannaz', 'laguz', 'ingwaz', 'dagaz', 'othala'])
  })
]);

/** Look up an aett by its 1-based number. Returns null when out of range. */
export function aettByNumber(number) {
  return AETTS.find((a) => a.number === Number(number)) || null;
}

/** Look up the aett a rune belongs to, by rune key. Returns null when unknown. */
export function aettForRuneKey(runeKey) {
  const key = String(runeKey || '').toLowerCase();
  return AETTS.find((a) => a.runeKeys.includes(key)) || null;
}

/** "Freyr's Aett — Creation and Wealth", for menus and headings. */
export function aettLabel(number) {
  const aett = aettByNumber(number);
  return aett ? `${aett.name} — ${aett.theme}` : `Aett ${number}`;
}
