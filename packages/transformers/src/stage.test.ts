import { describe, expect, it } from 'vitest';
import type { SourceRecord } from '@efa/schemas';
import { transformExtractedRecords } from './stage.js';

const reference = {
    sourceSite: 'norse-mythology.org',
    sourceUrl: 'https://norse-mythology.org/runes/the-meanings-of-the-runes/',
    extractedAt: '2026-04-11T00:00:00.000Z',
    extractorVersion: '0.1.0',
    contentHash: 'abc123',
    classification: 'reference_like' as const
};

function record(kind: SourceRecord['kind'], id: string, title: string): SourceRecord {
    return {
        id,
        kind,
        title,
        summary: `${title} summary`,
        sections: [{ text: `${title} section` }],
        references: [{ ...reference }],
        tags: ['tag1']
    };
}

describe('transformExtractedRecords', () => {
    it('maps canonical entities and keeps adjacent/practice records separated', () => {
        const output = transformExtractedRecords([
            record('rune_source', 'r1', 'Fehu'),
            record('deity_source', 'd1', 'Odin'),
            record('world_source', 'w1', 'Asgard'),
            record('practice_source', 'p1', 'Rune Casting'),
            record('adjacent_source', 'a1', 'Icelandic Staves')
        ]);

        expect(output.runes).toHaveLength(1);
        expect(output.deities).toHaveLength(1);
        expect(output.worlds).toHaveLength(1);
        expect(output.practices).toHaveLength(1);
        expect(output.adjacentSystems).toHaveLength(1);

        expect(output.runes[0]?.name).toBe('Fehu');
        expect(output.deities[0]?.name).toBe('Odin');
        expect(output.worlds[0]?.name).toBe('Asgard');
        expect(output.practices[0]?.kind).toBe('practice_source');
        expect(output.adjacentSystems[0]?.kind).toBe('adjacent_source');
    });
});
