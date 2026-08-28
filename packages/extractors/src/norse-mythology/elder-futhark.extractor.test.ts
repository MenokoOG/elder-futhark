import { describe, expect, it } from 'vitest';
import { elderFutharkExtractor } from './elder-futhark.extractor.js';
import type { ExtractorContext } from '../common/page-extractor.js';

const CONTEXT: ExtractorContext = {
    sourceId: 'norse-runes',
    sourceUrl: 'https://norse-mythology.org/runes/the-meanings-of-the-runes/',
    classification: 'reference_like',
    fetchedAt: '2026-04-11T00:00:00.000Z',
    contentHash: 'abc123'
};

/** One rune paragraph in the shape the source page uses. */
function runeParagraph(name: string, gloss: string, phoneme: string, meaning: string): string {
    return (
        `<p><a href="http://example.test/${name}.png">` +
        `<img src="http://example.test/${name}.png" title="${name}" /></a> ` +
        `Name: ${name}, &#8220;${gloss}.&#8221; Phoneme: ${phoneme}. Meaning: ${meaning}.</p>`
    );
}

const ROW = [
    'Fehu', 'Uruz', 'Thurisaz', 'Ansuz', 'Raidho', 'Kaunan', 'Gebo', 'Wunjo',
    'Hagalaz', 'Naudhiz', 'Isa', 'Jera', 'Eiwaz', 'Pertho', 'Algiz', 'Sowilo',
    'Tiwaz', 'Berkanan', 'Ehwaz', 'Mannaz', 'Laguz', 'Ingwaz', 'Othala', 'Dagaz'
];

function pageWith(names: string[]): string {
    const body = names.map((name) => runeParagraph(name, 'gloss', 'X', 'a meaning')).join('');
    return `<html><head><title>The Meanings of the Runes</title></head><body><main><p>Intro prose.</p>${body}</main></body></html>`;
}

describe('elderFutharkExtractor', () => {
    it('extracts one record per rune, keyed by the image title', () => {
        const records = elderFutharkExtractor(pageWith(ROW), CONTEXT);

        expect(records).toHaveLength(24);
        expect(records[0]?.id).toBe('norse-runes:fehu');
        expect(records[0]?.title).toBe('Fehu');
        expect(records[0]?.kind).toBe('rune_source');
    });

    it('parses the name, phoneme and meaning into separate sections', () => {
        const html = pageWith(ROW).replace(
            runeParagraph('Fehu', 'gloss', 'X', 'a meaning'),
            runeParagraph('Fehu', 'cattle', 'F', 'wealth')
        );
        const record = elderFutharkExtractor(html, CONTEXT)[0];

        expect(record?.summary).toBe('wealth');
        expect(record?.sections).toEqual([
            // Kept verbatim, stop included: this field records what the source says.
            { heading: 'attested-name', text: 'Fehu, “cattle.”' },
            { heading: 'phoneme', text: 'F' },
            { heading: 'meaning', text: 'wealth' }
        ]);
    });

    it('carries the source classification on the reference, never in the tags', () => {
        const record = elderFutharkExtractor(pageWith(ROW), CONTEXT)[0];

        expect(record?.tags).toEqual([]);
        expect(record?.references[0]?.classification).toBe('reference_like');
    });

    it('throws when the row is short, rather than publishing a partial futhark', () => {
        expect(() => elderFutharkExtractor(pageWith(ROW.slice(0, 23)), CONTEXT)).toThrow(/23 runes, expected 24/);
    });

    it('throws when the selectors match nothing at all', () => {
        const html = '<html><body><main><p>No runes here.</p></main></body></html>';

        expect(() => elderFutharkExtractor(html, CONTEXT)).toThrow(/selector drift/i);
    });
});
