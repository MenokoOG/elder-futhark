import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { diffCommand } from './diff.js';

const tempDirs: string[] = [];
const cwdStack: string[] = [];

afterEach(async () => {
    while (cwdStack.length > 0) {
        const previous = cwdStack.pop();
        if (previous) {
            process.chdir(previous);
        }
    }

    await Promise.all(tempDirs.map(async (dir) => rm(dir, { recursive: true, force: true })));
    tempDirs.length = 0;
});

async function setupWorkspace(options: {
    normalized: {
        runes: unknown[];
        deities: unknown[];
        worlds: unknown[];
    };
    published: {
        runes: unknown[];
        deities: unknown[];
        worlds: unknown[];
    };
}): Promise<string> {
    const root = await mkdtemp(join(tmpdir(), 'efa-diff-test-'));
    tempDirs.push(root);

    const cliDir = join(root, 'apps', 'cli');
    await mkdir(cliDir, { recursive: true });

    await writeFile(
        join(root, 'SOURCE_REGISTRY.json'),
        JSON.stringify({
            sources: [
                {
                    id: 'norse-runes',
                    url: 'https://norse-mythology.org/runes/the-meanings-of-the-runes/',
                    classification: 'reference_like'
                }
            ]
        })
    );

    const normalizedDir = join(root, 'data', 'normalized');
    const publishedDir = join(root, 'data', 'published');
    await mkdir(normalizedDir, { recursive: true });
    await mkdir(publishedDir, { recursive: true });

    await writeFile(join(normalizedDir, 'runes.json'), JSON.stringify(options.normalized.runes));
    await writeFile(join(normalizedDir, 'deities.json'), JSON.stringify(options.normalized.deities));
    await writeFile(join(normalizedDir, 'worlds.json'), JSON.stringify(options.normalized.worlds));

    await writeFile(join(publishedDir, 'runes.json'), JSON.stringify(options.published.runes));
    await writeFile(join(publishedDir, 'deities.json'), JSON.stringify(options.published.deities));
    await writeFile(join(publishedDir, 'worlds.json'), JSON.stringify(options.published.worlds));

    return cliDir;
}

describe('diffCommand', () => {
    it('reports added, removed, and changed entities by collection', async () => {
        const cliDir = await setupWorkspace({
            normalized: {
                runes: [
                    { id: 'fehu', name: 'Fehu', confidence: 0.7 },
                    { id: 'uruz', name: 'Uruz', confidence: 0.8 }
                ],
                deities: [{ id: 'odin', name: 'Odin' }],
                worlds: [{ id: 'asgard', name: 'Asgard', summary: 'Realm of the Aesir' }]
            },
            published: {
                runes: [
                    { id: 'fehu', name: 'Fehu', confidence: 0.6 },
                    { id: 'thurisaz', name: 'Thurisaz', confidence: 0.8 }
                ],
                deities: [{ id: 'odin', name: 'Odin' }],
                worlds: [{ id: 'midgard', name: 'Midgard', summary: 'Realm of humankind' }]
            }
        });

        cwdStack.push(process.cwd());
        process.chdir(cliDir);

        const result = await diffCommand();

        expect(result.hasChanges).toBe(true);

        const runes = result.collections.find((collection) => collection.collection === 'runes');
        expect(runes).toBeTruthy();
        expect(runes?.added).toEqual(['uruz']);
        expect(runes?.removed).toEqual(['thurisaz']);
        expect(runes?.changed).toEqual(['fehu']);
        expect(runes?.unchangedCount).toBe(0);

        const deities = result.collections.find((collection) => collection.collection === 'deities');
        expect(deities).toBeTruthy();
        expect(deities?.added).toEqual([]);
        expect(deities?.removed).toEqual([]);
        expect(deities?.changed).toEqual([]);
        expect(deities?.unchangedCount).toBe(1);

        const worlds = result.collections.find((collection) => collection.collection === 'worlds');
        expect(worlds).toBeTruthy();
        expect(worlds?.added).toEqual(['asgard']);
        expect(worlds?.removed).toEqual(['midgard']);
        expect(worlds?.changed).toEqual([]);
        expect(worlds?.unchangedCount).toBe(0);
    });

    it('returns no changes when normalized and published artifacts match', async () => {
        const sharedRunes = [{ id: 'fehu', name: 'Fehu', confidence: 0.9 }];
        const sharedDeities = [{ id: 'odin', name: 'Odin', aliases: ['Woden'] }];
        const sharedWorlds = [{ id: 'asgard', name: 'Asgard', associations: ['aesir'] }];

        const cliDir = await setupWorkspace({
            normalized: {
                runes: sharedRunes,
                deities: sharedDeities,
                worlds: sharedWorlds
            },
            published: {
                runes: sharedRunes,
                deities: sharedDeities,
                worlds: sharedWorlds
            }
        });

        cwdStack.push(process.cwd());
        process.chdir(cliDir);

        const result = await diffCommand();

        expect(result.hasChanges).toBe(false);
        expect(result.collections.every((collection) => collection.added.length === 0)).toBe(true);
        expect(result.collections.every((collection) => collection.removed.length === 0)).toBe(true);
        expect(result.collections.every((collection) => collection.changed.length === 0)).toBe(true);
    });
});
