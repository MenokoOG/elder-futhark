import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { reviewCommand } from './review.js';

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
    const root = await mkdtemp(join(tmpdir(), 'efa-review-test-'));
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
                domains: [],
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

    await writeFile(
        join(normalizedDir, 'worlds.json'),
        JSON.stringify([
            {
                id: 'asgard',
                name: 'Asgard',
                summary: 'Realm of the Aesir',
                associations: [],
                sources: [
                    {
                        sourceSite: 'norse-mythology.org',
                        sourceUrl: 'https://norse-mythology.org/cosmology/the-nine-worlds/asgard/',
                        extractedAt: '2026-04-11T00:00:00.000Z',
                        extractorVersion: '0.1.0',
                        contentHash: 'abc123',
                        classification: 'reference_like'
                    }
                ],
                confidence: 0.8
            }
        ])
    );

    await writeFile(
        join(normalizedDir, 'practices.records.json'),
        JSON.stringify([
            {
                id: 'practice-1',
                kind: 'practice_source',
                title: 'Rune Casting',
                summary: 'Practice summary',
                sections: [{ text: 'section' }],
                references: [
                    {
                        sourceSite: 'andreashelley.com',
                        sourceUrl: 'https://andreashelley.com/blog/rune-casting-guide-how-to-read-the-runes/',
                        extractedAt: '2026-04-11T00:00:00.000Z',
                        extractorVersion: '0.1.0',
                        contentHash: 'abc123',
                        classification: 'practical_guide'
                    }
                ],
                tags: ['practical_guide']
            }
        ])
    );

    await writeFile(
        join(normalizedDir, 'adjacent-systems.records.json'),
        JSON.stringify([
            {
                id: 'adjacent-1',
                kind: 'adjacent_source',
                title: 'Icelandic Staves',
                summary: 'Adjacent summary',
                sections: [{ text: 'section' }],
                references: [
                    {
                        sourceSite: 'andreashelley.com',
                        sourceUrl: 'https://andreashelley.com/blog/icelandic-magic-staves/',
                        extractedAt: '2026-04-11T00:00:00.000Z',
                        extractorVersion: '0.1.0',
                        contentHash: 'abc123',
                        classification: 'adjacent_symbolic_system'
                    }
                ],
                tags: ['adjacent_symbolic_system']
            }
        ])
    );

    return cliDir;
}

describe('reviewCommand', () => {
    it('returns provenance and classification summary for normalized artifacts', async () => {
        const cliDir = await setupWorkspace();
        cwdStack.push(process.cwd());
        process.chdir(cliDir);

        const result = await reviewCommand();

        expect(result.runes).toBe(1);
        expect(result.deities).toBe(1);
        expect(result.worlds).toBe(1);
        expect(result.practices).toBe(1);
        expect(result.adjacentSystems).toBe(1);
        expect(result.classificationCounts.practical_guide).toBe(1);
        expect(result.classificationCounts.adjacent_symbolic_system).toBe(1);
    });

    it('fails when a core canonical record contains adjacent classification', async () => {
        const cliDir = await setupWorkspace();
        cwdStack.push(process.cwd());
        process.chdir(cliDir);

        await writeFile(
            join(cliDir, '..', '..', 'data', 'normalized', 'deities.json'),
            JSON.stringify([
                {
                    id: 'odin',
                    name: 'Odin',
                    aliases: [],
                    domains: [],
                    description: 'Allfather',
                    sources: [
                        {
                            sourceSite: 'andreashelley.com',
                            sourceUrl: 'https://andreashelley.com/blog/icelandic-magic-staves/',
                            extractedAt: '2026-04-11T00:00:00.000Z',
                            extractorVersion: '0.1.0',
                            contentHash: 'abc123',
                            classification: 'adjacent_symbolic_system'
                        }
                    ],
                    confidence: 0.85
                }
            ])
        );

        await expect(reviewCommand()).rejects.toThrow(/core canonical record includes adjacent classification/i);
    });
});
