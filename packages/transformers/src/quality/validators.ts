import type { Rune } from '@efa/schemas';
import { ELDER_FUTHARK, ELDER_FUTHARK_RUNE_COUNT } from '../canon/elder-futhark.js';

export function ensureNonEmptyArray<T>(input: T[]): T[] {
    if (input.length === 0) {
        throw new Error('Expected non-empty array');
    }

    return input;
}

/** Unicode Runic block. A rune glyph outside it is not a rune. */
const RUNIC_BLOCK = /^[\u16A0-\u16FF]+$/u;

/**
 * Guards against the failure that put four article headings into the published
 * rune dataset, each with a Latin letter for a glyph.
 *
 * A silently wrong dataset is worse than a failed run: the app renders it, and
 * nobody finds out until a reader is taught that the rune for "T" is called
 * "The Meanings Of The Runes".
 */
export function assertRunicGlyphs(runes: Rune[]): void {
    const offenders = runes.filter((rune) => !RUNIC_BLOCK.test(rune.glyph));

    if (offenders.length > 0) {
        const detail = offenders
            .slice(0, 5)
            .map((rune) => `${rune.id} (glyph ${JSON.stringify(rune.glyph)})`)
            .join(', ');
        throw new Error(
            `${offenders.length} rune record(s) carry a glyph outside the Unicode Runic block ` +
                `(U+16A0-U+16FF): ${detail}. This is selector drift, not a content change.`
        );
    }
}

/**
 * The Elder Futhark is a closed set of twenty-four. Publishing a partial row
 * is a silent data loss, so it fails the run instead.
 */
export function assertElderFutharkComplete(runes: Rune[]): void {
    if (runes.length !== ELDER_FUTHARK_RUNE_COUNT) {
        throw new Error(
            `Expected ${ELDER_FUTHARK_RUNE_COUNT} Elder Futhark runes, got ${runes.length}. ` +
                `The rune row is a closed set; refusing to publish a partial row.`
        );
    }

    const present = new Set(runes.map((rune) => rune.id));
    const missing = ELDER_FUTHARK.filter((rune) => !present.has(rune.key)).map((rune) => rune.key);

    if (missing.length > 0) {
        throw new Error(`Published rune set is missing: ${missing.join(', ')}.`);
    }
}

/**
 * Content fields must never carry a source-classification value. That leak is
 * what made every deity come out with domains: ["reference_like"].
 */
const CLASSIFICATIONS = new Set([
    'reference_like',
    'practical_guide',
    'modern_interpretation',
    'adjacent_symbolic_system'
]);

export function assertNoClassificationLeak(field: string, values: string[], recordId: string): void {
    const leaked = values.filter((value) => CLASSIFICATIONS.has(value));

    if (leaked.length > 0) {
        throw new Error(
            `Record ${recordId} has source classification value(s) ${leaked.join(', ')} in its ` +
                `"${field}" content field. Classification belongs on the source reference, not the content.`
        );
    }
}
