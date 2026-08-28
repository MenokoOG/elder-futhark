import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { ELDER_FUTHARK } from '@efa/transformers';
import { validateCommand } from './validate.js';

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
    const root = await mkdtemp(join(tmpdir(), 'efa-validate-test-'));
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

    // A full, valid rune row. The Elder Futhark is a closed set of twenty-four,
    // and validateCommand now refuses a short one.
    await writeFile(
        join(normalizedDir, 'runes.json'),
        JSON.stringify(
            ELDER_FUTHARK.map((entry) => ({
                id: entry.key,
                glyph: entry.glyph,
                name: entry.key,
                phonetic: [],
                coreMeanings: ['a meaning'],
                historicalNotes: ['historical'],
                interpretiveNotes: [],
                keywords: [],
                sources: [
                    {
                        sourceSite: 'norse-mythology.org',
                        sourceUrl: 'https://norse-mythology.org/runes/the-meanings-of-the-runes/',
                        extractedAt: '2026-04-11T00:00:00.000Z',
                        extractorVersion: '0.2.0',
                        contentHash: 'abc123',
                        classification: 'reference_like'
                    }
                ],
                confidence: 0.8
            }))
        )
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
                        sourceUrl: 'https://norse-mythology.org/gods-and-creatures/',
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
                        sourceUrl: 'https://norse-mythology.org/cosmology/the-nine-worlds/',
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

describe('validateCommand', () => {
    it('validates normalized outputs successfully', async () => {
        const cliDir = await setupWorkspace();
        cwdStack.push(process.cwd());
        process.chdir(cliDir);

        const result = await validateCommand();
        expect(result.runes).toBe(24);
        expect(result.deities).toBe(1);
        expect(result.worlds).toBe(1);
        expect(result.practices).toBe(1);
        expect(result.adjacentSystems).toBe(1);
    });

    it('refuses a partial rune row rather than publishing it', async () => {
        const cliDir = await setupWorkspace();
        cwdStack.push(process.cwd());
        process.chdir(cliDir);

        const runesPath = join(cliDir, '..', '..', 'data', 'normalized', 'runes.json');
        const full = JSON.parse(await readFile(runesPath, 'utf8')) as unknown[];
        await writeFile(runesPath, JSON.stringify(full.slice(0, 4)));

        await expect(validateCommand()).rejects.toThrow(/closed set|expected 24/i);
    });

    it('fails when practice and adjacent boundaries are violated', async () => {
        const cliDir = await setupWorkspace();
        cwdStack.push(process.cwd());
        process.chdir(cliDir);

        await writeFile(
            join(cliDir, '..', '..', 'data', 'normalized', 'practices.records.json'),
            JSON.stringify([
                {
                    id: 'bad-1',
                    kind: 'adjacent_source',
                    title: 'Wrong Kind',
                    summary: 'bad',
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
                    tags: []
                }
            ])
        );

        await expect(validateCommand()).rejects.toThrow(/practice bucket contains non-practice/i);
    });
});
