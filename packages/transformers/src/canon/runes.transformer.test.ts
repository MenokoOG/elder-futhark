import { describe, expect, it } from 'vitest';
import type { SourceRecord } from '@efa/schemas';
import { runes } from './runes.transformer.js';

function runeRecord(title: string, phoneme = 'F', meaning = 'wealth'): SourceRecord {
    return {
        id: `norse-runes:${title.toLowerCase()}`,
        kind: 'rune_source',
        title,
        summary: meaning,
        sections: [
            { heading: 'attested-name', text: `${title}, "gloss."` },
            { heading: 'phoneme', text: phoneme },
            { heading: 'meaning', text: meaning }
        ],
        references: [
            {
                sourceSite: 'norse-mythology.org',
                sourceUrl: 'https://norse-mythology.org/runes/the-meanings-of-the-runes/',
                extractedAt: '2026-04-11T00:00:00.000Z',
                extractorVersion: '0.2.0',
                contentHash: 'abc123',
                classification: 'reference_like'
            }
        ],
        tags: []
    };
}

describe('runes transformer', () => {
    it('takes the glyph from the canonical table, not the page title', () => {
        const [rune] = runes([runeRecord('Fehu')]);

        expect(rune?.id).toBe('fehu');
        expect(rune?.glyph).toBe('\u16A0');
        expect(rune?.name).toBe('Fehu');
    });

    it('resolves source name variants onto one canonical rune', () => {
        // The source writes Kaunan, Naudhiz, Berkanan and Othalan.
        const mapped = runes([
            runeRecord('Kaunan'),
            runeRecord('Naudhiz'),
            runeRecord('Berkanan'),
            runeRecord('Othalan')
        ]);

        expect(mapped.map((rune) => rune.id)).toEqual(['kenaz', 'nauthiz', 'berkano', 'othala']);
    });

    it('splits a plain comma list into separate meanings', () => {
        const [rune] = runes([runeRecord('Thurisaz', 'Th', 'danger, suffering')]);

        expect(rune?.coreMeanings).toEqual(['danger', 'suffering']);
    });

    it('keeps a hedged meaning whole instead of splitting it into claims', () => {
        const hedge = 'unknown (the rune poems are ambiguous and contradictory)';
        const [rune] = runes([runeRecord('Isa', 'I', hedge)]);

        expect(rune?.coreMeanings).toEqual([hedge]);
    });

    it('throws on an unrecognised rune name rather than inventing a glyph', () => {
        // This is the record that used to become a rune with the glyph "T".
        expect(() => runes([runeRecord('The Meanings Of The Runes')])).toThrow(/Unrecognised Elder Futhark rune name/);
    });

    it('ignores records that are not rune sources', () => {
        const article: SourceRecord = { ...runeRecord('Fehu'), kind: 'generic_page' };

        expect(runes([article])).toEqual([]);
    });
});
