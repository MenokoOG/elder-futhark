import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import {
    DeitySchema,
    RuneSchema,
    SourceRecordSchema,
    WorldSchema,
    type Deity,
    type Rune,
    type SourceRecord,
    type World
} from '@efa/schemas';
import { loadConfig, resolveSourceRegistryPath } from '@efa/config';
import { assertElderFutharkComplete } from '@efa/transformers';

export interface ValidateCommandResult {
    runes: number;
    deities: number;
    worlds: number;
    practices: number;
    adjacentSystems: number;
    paths: string[];
}

async function readJson(path: string): Promise<unknown> {
    let raw: string;
    try {
        raw = await readFile(path, 'utf8');
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to read required file at ${path}: ${message}`);
    }

    try {
        return JSON.parse(raw);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Invalid JSON at ${path}: ${message}`);
    }
}

function assertPracticeBoundary(practices: SourceRecord[], adjacentSystems: SourceRecord[]): void {
    const nonPractice = practices.find((record) => record.kind !== 'practice_source');
    if (nonPractice) {
        throw new Error(`practice bucket contains non-practice record: ${nonPractice.id} (${nonPractice.kind})`);
    }

    const nonAdjacent = adjacentSystems.find((record) => record.kind !== 'adjacent_source');
    if (nonAdjacent) {
        throw new Error(`adjacent bucket contains non-adjacent record: ${nonAdjacent.id} (${nonAdjacent.kind})`);
    }
}

export async function validateCommand(): Promise<ValidateCommandResult> {
    const config = loadConfig();
    const registryPath = await resolveSourceRegistryPath();
    const baseDir = dirname(registryPath);
    const outputDir = resolve(baseDir, config.EFA_OUTPUT_DIR);
    const normalizedDir = resolve(outputDir, 'normalized');

    const runesPath = resolve(normalizedDir, 'runes.json');
    const deitiesPath = resolve(normalizedDir, 'deities.json');
    const worldsPath = resolve(normalizedDir, 'worlds.json');
    const practicesPath = resolve(normalizedDir, 'practices.records.json');
    const adjacentPath = resolve(normalizedDir, 'adjacent-systems.records.json');

    const runes = RuneSchema.array().parse(await readJson(runesPath)) as Rune[];
    const deities = DeitySchema.array().parse(await readJson(deitiesPath)) as Deity[];
    const worlds = WorldSchema.array().parse(await readJson(worldsPath)) as World[];
    const practices = SourceRecordSchema.array().parse(await readJson(practicesPath)) as SourceRecord[];
    const adjacentSystems = SourceRecordSchema.array().parse(await readJson(adjacentPath)) as SourceRecord[];

    assertPracticeBoundary(practices, adjacentSystems);

    // The Elder Futhark is a closed set of twenty-four. A short row means an
    // extractor lost runes silently, which is exactly the failure that let four
    // article headings reach the published dataset.
    assertElderFutharkComplete(runes);

    return {
        runes: runes.length,
        deities: deities.length,
        worlds: worlds.length,
        practices: practices.length,
        adjacentSystems: adjacentSystems.length,
        paths: [runesPath, deitiesPath, worldsPath, practicesPath, adjacentPath]
    };
}
