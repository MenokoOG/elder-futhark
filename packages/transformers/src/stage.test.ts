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

function recordWithUrl(kind: SourceRecord['kind'], id: string, title: string, sourceUrl: string): SourceRecord {
    return {
        ...record(kind, id, title),
        references: [{ ...reference, sourceUrl }]
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

    it('derives stable IDs from source URLs when page titles are generic', () => {
        const output = transformExtractedRecords([
            recordWithUrl('deity_source', 'd1', 'Norse Mythology for Smart People', 'https://norse-mythology.org/gods-and-creatures/the-aesir-gods-and-goddesses/odin/'),
            recordWithUrl('deity_source', 'd2', 'Norse Mythology for Smart People', 'https://norse-mythology.org/gods-and-creatures/the-aesir-gods-and-goddesses/thor/'),
            recordWithUrl('world_source', 'w1', 'Norse Mythology for Smart People', 'https://norse-mythology.org/cosmology/the-nine-worlds/asgard/'),
            recordWithUrl('world_source', 'w2', 'Norse Mythology for Smart People', 'https://norse-mythology.org/cosmology/the-nine-worlds/midgard/'),
            recordWithUrl('rune_source', 'r1', 'Norse Mythology for Smart People', 'https://norse-mythology.org/runes/the-meanings-of-the-runes/'),
            recordWithUrl('rune_source', 'r2', 'Norse Mythology for Smart People', 'https://norse-mythology.org/runes/the-origins-of-the-runes/')
        ]);

        const deityIds = output.deities.map((item) => item.id).sort();
        const worldIds = output.worlds.map((item) => item.id).sort();
        const runeIds = output.runes.map((item) => item.id).sort();

        expect(deityIds).toEqual(['odin', 'thor']);
        expect(worldIds).toEqual(['asgard', 'midgard']);
        expect(runeIds).toEqual(['the-meanings-of-the-runes', 'the-origins-of-the-runes']);
    });
});
