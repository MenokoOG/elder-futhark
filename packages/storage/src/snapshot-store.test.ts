import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { writeRawSnapshot } from './snapshot-store.js';

const tempDirs: string[] = [];

afterEach(async () => {
    await Promise.all(tempDirs.map(async (dir) => rm(dir, { recursive: true, force: true })));
    tempDirs.length = 0;
});

describe('writeRawSnapshot', () => {
    it('writes html and metadata to flat files keyed by source id', async () => {
        const outputDir = await mkdtemp(join(tmpdir(), 'efa-storage-test-'));
        tempDirs.push(outputDir);

        const result = await writeRawSnapshot(outputDir, {
            sourceId: 'norse-runes',
            classification: 'reference_like',
            url: 'https://norse-mythology.org/runes/the-meanings-of-the-runes/',
            fetchedAt: '2026-04-11T00:00:00.000Z',
            contentHash: 'abc123',
            statusCode: 200,
            html: '<html><body>ok</body></html>'
        });

        const html = await readFile(result.htmlPath, 'utf8');
        const metadata = JSON.parse(await readFile(result.metadataPath, 'utf8')) as Record<string, unknown>;

        expect(result.htmlPath.endsWith('raw/norse-runes.html')).toBe(true);
        expect(result.metadataPath.endsWith('raw/norse-runes.metadata.json')).toBe(true);
        expect(html).toContain('<body>ok</body>');

        expect(metadata).toMatchObject({
            sourceId: 'norse-runes',
            classification: 'reference_like',
            url: 'https://norse-mythology.org/runes/the-meanings-of-the-runes/',
            fetchedAt: '2026-04-11T00:00:00.000Z',
            contentHash: 'abc123',
            statusCode: 200
        });
    });
});
