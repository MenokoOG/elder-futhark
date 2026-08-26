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
import { loadConfig, resolveSourceRegistryPath, type SourceClassification } from '@efa/config';

export interface ReviewCommandResult {
    runes: number;
    deities: number;
    worlds: number;
    practices: number;
    adjacentSystems: number;
    classificationCounts: Record<SourceClassification, number>;
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

function countClassifications(records: SourceRecord[]): Record<SourceClassification, number> {
    const counts: Record<SourceClassification, number> = {
        reference_like: 0,
        practical_guide: 0,
        modern_interpretation: 0,
        adjacent_symbolic_system: 0
    };

    for (const record of records) {
        for (const reference of record.references) {
            counts[reference.classification] += 1;
        }
    }

    return counts;
}

function assertCoreBoundary(
    runes: Rune[],
    deities: Deity[],
    worlds: World[],
    practices: SourceRecord[],
    adjacentSystems: SourceRecord[]
): void {
    const coreEntries = [...runes, ...deities, ...worlds];
    const coreWithAdjacent = coreEntries.find((entry) =>
        entry.sources.some((source) => source.classification === 'adjacent_symbolic_system')
    );
    if (coreWithAdjacent) {
        throw new Error(`core canonical record includes adjacent classification: ${coreWithAdjacent.id}`);
    }

    const practiceWithAdjacent = practices.find((record) =>
        record.references.some((source) => source.classification === 'adjacent_symbolic_system')
    );
    if (practiceWithAdjacent) {
        throw new Error(`practice bucket includes adjacent classification: ${practiceWithAdjacent.id}`);
    }

    const adjacentWithPractice = adjacentSystems.find((record) =>
        record.references.some((source) => source.classification === 'practical_guide')
    );
    if (adjacentWithPractice) {
        throw new Error(`adjacent bucket includes practical classification: ${adjacentWithPractice.id}`);
    }
}

function assertReferencesPresent(runes: Rune[], deities: Deity[], worlds: World[]): void {
    const all = [...runes, ...deities, ...worlds];
    const missing = all.find((entry) => entry.sources.length === 0);
    if (missing) {
        throw new Error(`canonical record missing provenance sources: ${missing.id}`);
    }
}

export async function reviewCommand(): Promise<ReviewCommandResult> {
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

    assertReferencesPresent(runes, deities, worlds);
    assertCoreBoundary(runes, deities, worlds, practices, adjacentSystems);

    const classificationCounts = countClassifications([...practices, ...adjacentSystems]);

    return {
        runes: runes.length,
        deities: deities.length,
        worlds: worlds.length,
        practices: practices.length,
        adjacentSystems: adjacentSystems.length,
        classificationCounts,
        paths: [runesPath, deitiesPath, worldsPath, practicesPath, adjacentPath]
    };
}
