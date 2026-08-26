import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { buildDatasetCommand } from './build-dataset.js';

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

async function setupWorkspace(): Promise<string> {
    const root = await mkdtemp(join(tmpdir(), 'efa-build-test-'));
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
                },
                {
                    id: 'norse-god-odin',
                    url: 'https://norse-mythology.org/gods-and-creatures/the-aesir-gods-and-goddesses/odin/',
                    classification: 'reference_like'
                }
            ]
        })
    );

    const normalizedDir = join(root, 'data', 'normalized');
    await mkdir(normalizedDir, { recursive: true });

    await writeFile(
        join(normalizedDir, 'runes.json'),
        JSON.stringify([
            {
                id: 'fehu',
                glyph: 'F',
                name: 'Fehu',
                phonetic: [],
                coreMeanings: ['wealth'],
                historicalNotes: ['historical'],
                interpretiveNotes: [],
                keywords: [],
                sources: [
                    {
                        sourceSite: 'norse-mythology.org',
                        sourceUrl: 'https://norse-mythology.org/runes/the-meanings-of-the-runes/',
                        extractedAt: '2026-04-11T00:00:00.000Z',
                        extractorVersion: '0.1.0',
                        contentHash: 'abc123',
                        classification: 'reference_like'
                    }
                ],
                confidence: 0.9
            }
        ])
    );

    await writeFile(
        join(normalizedDir, 'deities.json'),
        JSON.stringify([
            {
                id: 'odin',
                name: 'Odin',
                aliases: [],
                domains: ['wisdom'],
                description: 'Allfather',
                sources: [
                    {
                        sourceSite: 'norse-mythology.org',
                        sourceUrl: 'https://norse-mythology.org/gods-and-creatures/the-aesir-gods-and-goddesses/odin/',
                        extractedAt: '2026-04-11T00:00:00.000Z',
                        extractorVersion: '0.1.0',
                        contentHash: 'abc123',
                        classification: 'reference_like'
                    }
                ],
                confidence: 0.85
            }
        ])
    );

    await writeFile(join(normalizedDir, 'worlds.json'), JSON.stringify([]));

    return cliDir;
}

describe('buildDatasetCommand', () => {
    it('publishes dataset artifacts and manifest counts', async () => {
        const cliDir = await setupWorkspace();
        cwdStack.push(process.cwd());
        process.chdir(cliDir);

        const result = await buildDatasetCommand();

        expect(result.manifest.sourceCount).toBe(2);
        expect(result.manifest.recordCount).toBe(2);
        expect(result.paths).toHaveLength(5);

        const datasetPath = result.paths.find((path) => path.endsWith('dataset.json'));
        expect(datasetPath).toBeTruthy();

        const dataset = JSON.parse(await readFile(datasetPath!, 'utf8')) as {
            manifest: { sourceCount: number; recordCount: number };
            runes: unknown[];
            deities: unknown[];
            worlds: unknown[];
        };

        expect(dataset.manifest.sourceCount).toBe(2);
        expect(dataset.manifest.recordCount).toBe(2);
        expect(dataset.runes).toHaveLength(1);
        expect(dataset.deities).toHaveLength(1);
        expect(dataset.worlds).toHaveLength(0);
    });
});
