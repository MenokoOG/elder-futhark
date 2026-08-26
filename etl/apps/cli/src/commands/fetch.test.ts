import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@efa/config', () => ({
    loadConfig: vi.fn(() => ({
        EFA_USER_AGENT: 'elder-futhark-etl/0.1 (+tests)',
        EFA_FETCH_DELAY_MS: 10,
        EFA_OUTPUT_DIR: './data'
    })),
    resolveSourceRegistryPath: vi.fn(async () => '/repo/SOURCE_REGISTRY.json'),
    loadSourceRegistry: vi.fn(async () => ({
        sources: [
            {
                id: 'norse-runes',
                url: 'https://norse-mythology.org/runes/the-meanings-of-the-runes/',
                classification: 'reference_like'
            },
            {
                id: 'andrea-runes',
                url: 'https://andreashelley.com/blog/futhark-runes-symbols-and-meanings/',
                classification: 'modern_interpretation'
            }
        ]
    }))
}));

vi.mock('@efa/fetcher', () => ({
    fetchSources: vi.fn(async (sources) =>
        sources.map((source: { id: string; url: string; classification: string }, index: number) => ({
            sourceId: source.id,
            classification: source.classification,
            url: source.url,
            statusCode: 200,
            fetchedAt: `2026-04-11T10:00:0${index}.000Z`,
            contentHash: `hash-${source.id}`,
            html: `<html>${source.id}</html>`
        }))
    )
}));

vi.mock('@efa/storage', () => ({
    writeRawSnapshot: vi.fn(async (outputDir: string, snapshot: { sourceId: string }) => ({
        htmlPath: `${outputDir}/raw/${snapshot.sourceId}.raw.txt`,
        metadataPath: `${outputDir}/raw/${snapshot.sourceId}.metadata.json`
    }))
}));

import { fetchSources } from '@efa/fetcher';
import { writeRawSnapshot } from '@efa/storage';
import { fetchCommand } from './fetch.js';

describe('fetchCommand', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('fetches all configured sources and writes snapshots', async () => {
        const result = await fetchCommand({ source: 'all' });

        expect(fetchSources).toHaveBeenCalledTimes(1);
        expect(writeRawSnapshot).toHaveBeenCalledTimes(2);
        expect(result.count).toBe(2);
        expect(result.paths).toHaveLength(4);
        expect(result.paths[0]).toContain('/repo/data/raw/norse-runes.raw.txt');
    });

    it('fetches one selected source by id', async () => {
        await fetchCommand({ source: 'norse-runes' });

        const call = vi.mocked(fetchSources).mock.calls[0];
        expect(call).toBeDefined();
        expect(call?.[0]).toHaveLength(1);
        expect(call?.[0]?.[0]?.id).toBe('norse-runes');
    });

    it('fails for unknown source id', async () => {
        await expect(fetchCommand({ source: 'does-not-exist' })).rejects.toThrow(/unknown source id/i);
    });
});
