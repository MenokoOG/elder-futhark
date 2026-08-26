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

    it('routes norse subpage ids to matching extractor families', () => {
        const runeRecords = extractSourceRecords({
            source: {
                id: 'norse-runes-origins',
                url: 'https://norse-mythology.org/runes/the-origins-of-the-runes/',
                classification: 'reference_like'
            },
            snapshot: {
                sourceId: 'norse-runes-origins',
                fetchedAt: '2026-04-11T00:00:00.000Z',
                contentHash: 'hash-rune',
                html: '<html><head><title>Origins</title></head><body><main><p>Origins text.</p></main></body></html>'
            }
        });

        const deityRecords = extractSourceRecords({
            source: {
                id: 'norse-god-odin',
                url: 'https://norse-mythology.org/gods-and-creatures/the-aesir-gods-and-goddesses/odin/',
                classification: 'reference_like'
            },
            snapshot: {
                sourceId: 'norse-god-odin',
                fetchedAt: '2026-04-11T00:00:00.000Z',
                contentHash: 'hash-god',
                html: '<html><head><title>Odin</title></head><body><main><p>Odin text.</p></main></body></html>'
            }
        });

        const worldRecords = extractSourceRecords({
            source: {
                id: 'norse-world-midgard',
                url: 'https://norse-mythology.org/cosmology/the-nine-worlds/midgard/',
                classification: 'reference_like'
            },
            snapshot: {
                sourceId: 'norse-world-midgard',
                fetchedAt: '2026-04-11T00:00:00.000Z',
                contentHash: 'hash-world',
                html: '<html><head><title>Midgard</title></head><body><main><p>Midgard text.</p></main></body></html>'
            }
        });

        expect(runeRecords[0]?.kind).toBe('rune_source');
        expect(deityRecords[0]?.kind).toBe('deity_source');
        expect(worldRecords[0]?.kind).toBe('world_source');
    });
});
