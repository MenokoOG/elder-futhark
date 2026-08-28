import { describe, expect, it } from 'vitest';
import type { Rune } from '@efa/schemas';
import { ELDER_FUTHARK } from '../canon/elder-futhark.js';
import { assertElderFutharkComplete, assertNoClassificationLeak, assertRunicGlyphs } from './validators.js';

function rune(id: string, glyph: string): Rune {
    return {
        id,
        glyph,
        name: id,
        phonetic: [],
        coreMeanings: [],
        historicalNotes: [],
        interpretiveNotes: [],
        keywords: [],
        sources: [
            {
                sourceSite: 'norse-mythology.org',
                sourceUrl: 'https://norse-mythology.org/runes/the-meanings-of-the-runes/',
                extractedAt: '2026-04-11T00:00:00.000Z',
                extractorVersion: '0.2.0',
                contentHash: 'abc123',
                classification: 'reference_like'
            }
        ],
        confidence: 0.75
    };
}

const FULL_ROW = ELDER_FUTHARK.map((entry) => rune(entry.key, entry.glyph));

describe('assertRunicGlyphs', () => {
    it('accepts glyphs from the Unicode Runic block', () => {
        expect(() => assertRunicGlyphs(FULL_ROW)).not.toThrow();
    });

    it('rejects a Latin letter posing as a glyph', () => {
        // The published dataset really did contain a rune with the glyph "T".
        expect(() => assertRunicGlyphs([rune('the-meanings-of-the-runes', 'T')])).toThrow(/Unicode Runic block/);
    });
});

describe('assertElderFutharkComplete', () => {
    it('accepts the full row of twenty-four', () => {
        expect(() => assertElderFutharkComplete(FULL_ROW)).not.toThrow();
    });

    it('refuses a short row', () => {
        expect(() => assertElderFutharkComplete(FULL_ROW.slice(0, 4))).toThrow(/expected 24|got 4/i);
    });

    it('names what is missing when the count still looks right', () => {
        // 24 records, but one rune duplicated and another absent.
        const withDuplicate = [...FULL_ROW.slice(0, 23), rune('fehu', 'ᚠ')];

        expect(() => assertElderFutharkComplete(withDuplicate)).toThrow(/missing: othala/i);
    });
});

describe('assertNoClassificationLeak', () => {
    it('accepts real content values', () => {
        expect(() => assertNoClassificationLeak('domains', ['war', 'wisdom'], 'odin')).not.toThrow();
    });

    it('rejects a source classification in a content field', () => {
        expect(() => assertNoClassificationLeak('domains', ['reference_like'], 'odin')).toThrow(
            /classification value/i
        );
    });
});
