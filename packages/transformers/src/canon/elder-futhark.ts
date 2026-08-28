/**
 * Canonical identity table for the twenty-four Elder Futhark runes.
 *
 * Sources name the runes inconsistently — the same rune appears as Kaunan or
 * Kenaz, Naudhiz or Nauthiz, Berkanan or Berkano, Othala or Othalan. This table
 * is the single place that decides which key a source name resolves to, so the
 * transformer never has to guess.
 *
 * Glyphs are Unicode Runic (U+16A0-U+16FF) and match the rune-row the Academy
 * already ships, so ETL output and application data agree on identity.
 *
 * A rune name that is not in this table is a hard error, not a warning: an
 * unrecognised name means the source page changed shape, and a silently
 * dropped or mis-keyed rune is worse than a failed run.
 */

export interface CanonicalRune {
    key: string;
    glyph: string;
    /** Lowercased names, as they appear across sources, that resolve to this rune. */
    aliases: readonly string[];
}

export const ELDER_FUTHARK: readonly CanonicalRune[] = Object.freeze([
    { key: 'fehu', glyph: '\u16A0', aliases: ['fehu', 'feoh', 'fe'] },
    { key: 'uruz', glyph: '\u16A2', aliases: ['uruz', 'ur'] },
    { key: 'thurisaz', glyph: '\u16A6', aliases: ['thurisaz', 'thurs', 'thorn'] },
    { key: 'ansuz', glyph: '\u16A8', aliases: ['ansuz', 'as', 'os'] },
    { key: 'raidho', glyph: '\u16B1', aliases: ['raidho', 'raido', 'raido', 'rad', 'reid'] },
    { key: 'kenaz', glyph: '\u16B2', aliases: ['kenaz', 'kaunan', 'kaunaz', 'kaun', 'cen'] },
    { key: 'gebo', glyph: '\u16B7', aliases: ['gebo', 'gyfu', 'gifu'] },
    { key: 'wunjo', glyph: '\u16B9', aliases: ['wunjo', 'wynn', 'wyn'] },
    { key: 'hagalaz', glyph: '\u16BA', aliases: ['hagalaz', 'haegl', 'hagall'] },
    { key: 'nauthiz', glyph: '\u16BE', aliases: ['nauthiz', 'naudhiz', 'naudiz', 'nyd', 'naud'] },
    { key: 'isa', glyph: '\u16C1', aliases: ['isa', 'isaz', 'is'] },
    { key: 'jera', glyph: '\u16C3', aliases: ['jera', 'jer', 'ger', 'ar'] },
    { key: 'eihwaz', glyph: '\u16C7', aliases: ['eihwaz', 'eiwaz', 'iwaz', 'eoh', 'yr'] },
    { key: 'perthro', glyph: '\u16C8', aliases: ['perthro', 'pertho', 'perth', 'pertra', 'peorth'] },
    { key: 'algiz', glyph: '\u16C9', aliases: ['algiz', 'elhaz', 'eolh'] },
    { key: 'sowilo', glyph: '\u16CB', aliases: ['sowilo', 'sowulo', 'sigel', 'sol'] },
    { key: 'tiwaz', glyph: '\u16CF', aliases: ['tiwaz', 'teiwaz', 'tir', 'tyr'] },
    { key: 'berkano', glyph: '\u16D2', aliases: ['berkano', 'berkanan', 'beorc', 'bjarkan'] },
    { key: 'ehwaz', glyph: '\u16D6', aliases: ['ehwaz', 'eh', 'eoh-horse'] },
    { key: 'mannaz', glyph: '\u16D7', aliases: ['mannaz', 'man', 'madr'] },
    { key: 'laguz', glyph: '\u16DA', aliases: ['laguz', 'lagu', 'logr'] },
    { key: 'ingwaz', glyph: '\u16DC', aliases: ['ingwaz', 'inguz', 'ing'] },
    { key: 'dagaz', glyph: '\u16DE', aliases: ['dagaz', 'daeg', 'dag'] },
    { key: 'othala', glyph: '\u16DF', aliases: ['othala', 'othalan', 'othila', 'odal', 'ethel'] }
]);

export const ELDER_FUTHARK_RUNE_COUNT = 24;

const BY_ALIAS = new Map<string, CanonicalRune>();
for (const rune of ELDER_FUTHARK) {
    BY_ALIAS.set(rune.key, rune);
    for (const alias of rune.aliases) {
        BY_ALIAS.set(alias, rune);
    }
}

/** Normalise a source-supplied rune name for lookup. */
export function normaliseRuneName(name: string): string {
    return name
        .trim()
        .toLowerCase()
        .replace(/[\u00FE\u00DE]/g, 'th')
        .replace(/[\u00F0\u00D0]/g, 'd')
        .replace(/[^a-z]/g, '');
}

/** Resolve a source-supplied rune name, or null when it is not recognised. */
export function findCanonicalRune(name: string): CanonicalRune | null {
    return BY_ALIAS.get(normaliseRuneName(name)) ?? null;
}

/** Resolve a rune name, throwing when it is unrecognised. */
export function requireCanonicalRune(name: string, context: string): CanonicalRune {
    const rune = findCanonicalRune(name);
    if (!rune) {
        throw new Error(
            `Unrecognised Elder Futhark rune name "${name}" in ${context}. ` +
                `The source page has probably changed shape. Add the name to the alias table in ` +
                `canon/elder-futhark.ts once it has been checked by a human.`
        );
    }
    return rune;
}
