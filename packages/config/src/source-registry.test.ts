import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { loadSourceRegistry } from './index.js';

const tempDirs: string[] = [];

afterEach(async () => {
    await Promise.all(tempDirs.map(async (dir) => rm(dir, { recursive: true, force: true })));
    tempDirs.length = 0;
});

async function makeRegistry(contents: string): Promise<string> {
    const dir = await mkdtemp(join(tmpdir(), 'efa-config-test-'));
    tempDirs.push(dir);
    const path = join(dir, 'SOURCE_REGISTRY.json');
    await writeFile(path, contents, 'utf8');
    return path;
}

describe('loadSourceRegistry', () => {
    it('loads a valid registry', async () => {
        const path = await makeRegistry(
            JSON.stringify(
                {
                    sources: [
                        {
                            id: 'norse-runes',
                            url: 'https://norse-mythology.org/runes/the-meanings-of-the-runes/',
                            classification: 'reference_like'
                        }
                    ]
                },
                null,
                2
            )
        );

        const registry = await loadSourceRegistry(path);
        expect(registry.sources).toHaveLength(1);
        expect(registry.sources[0]?.id).toBe('norse-runes');
    });

    it('fails loudly on malformed json', async () => {
        const path = await makeRegistry('{not-json');

        await expect(loadSourceRegistry(path)).rejects.toThrow(/parse source registry json/i);
    });

    it('fails loudly on duplicate source ids', async () => {
        const path = await makeRegistry(
            JSON.stringify({
                sources: [
                    {
                        id: 'norse-runes',
                        url: 'https://norse-mythology.org/runes/the-meanings-of-the-runes/',
                        classification: 'reference_like'
                    },
                    {
                        id: 'norse-runes',
                        url: 'https://norse-mythology.org/cosmology/the-nine-worlds/',
                        classification: 'reference_like'
                    }
                ]
            })
        );

        await expect(loadSourceRegistry(path)).rejects.toThrow(/duplicate source id/i);
    });

    it('fails on non-allowlisted hosts', async () => {
        const path = await makeRegistry(
            JSON.stringify({
                sources: [
                    {
                        id: 'bad-host',
                        url: 'https://example.com/anything',
                        classification: 'reference_like'
                    }
                ]
            })
        );

        await expect(loadSourceRegistry(path)).rejects.toThrow(/host is not allowlisted/i);
    });

    it('fails on unsupported protocols', async () => {
        const path = await makeRegistry(
            JSON.stringify({
                sources: [
                    {
                        id: 'bad-protocol',
                        url: 'ftp://norse-mythology.org/runes',
                        classification: 'reference_like'
                    }
                ]
            })
        );

        await expect(loadSourceRegistry(path)).rejects.toThrow(/http\(s\) protocol/i);
    });

    it('fails on invalid source id format', async () => {
        const path = await makeRegistry(
            JSON.stringify({
                sources: [
                    {
                        id: 'Invalid Id',
                        url: 'https://norse-mythology.org/runes/the-meanings-of-the-runes/',
                        classification: 'reference_like'
                    }
                ]
            })
        );

        await expect(loadSourceRegistry(path)).rejects.toThrow(/source id must contain only lowercase letters/i);
    });
});
