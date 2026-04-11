import { describe, expect, it } from 'vitest';
import { extractSourceRecords } from './stage.js';

describe('extractSourceRecords', () => {
    it('extracts records with preserved provenance fields', () => {
        const records = extractSourceRecords({
            source: {
                id: 'norse-runes',
                url: 'https://norse-mythology.org/runes/the-meanings-of-the-runes/',
                classification: 'reference_like'
            },
            snapshot: {
                sourceId: 'norse-runes',
                fetchedAt: '2026-04-11T00:00:00.000Z',
                contentHash: 'abc123',
                html: '<html><head><title>Runes</title></head><body><main><p>First paragraph.</p><p>Second paragraph.</p></main></body></html>'
            }
        });

        expect(records).toHaveLength(1);
        expect(records[0]?.kind).toBe('rune_source');
        expect(records[0]?.references[0]).toMatchObject({
            sourceUrl: 'https://norse-mythology.org/runes/the-meanings-of-the-runes/',
            classification: 'reference_like',
            extractedAt: '2026-04-11T00:00:00.000Z',
            contentHash: 'abc123'
        });
        expect(records[0]?.sections.length).toBeGreaterThan(0);
    });
});
