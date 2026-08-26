import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { loadConfig, loadSourceRegistry, resolveSourceRegistryPath } from '@efa/config';
import { SourceRecordSchema, type SourceRecord } from '@efa/schemas';
import { writeJson } from '@efa/storage';
import { transformExtractedRecords } from '@efa/transformers';

async function readExtractedRecords(outputDir: string, sourceId: string): Promise<SourceRecord[]> {
    const path = resolve(outputDir, 'extracted', `${sourceId}.records.json`);

    let raw: string;
    try {
        raw = await readFile(path, 'utf8');
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Missing extracted records for ${sourceId} at ${path}: ${message}`);
    }

    let parsed: unknown;
    try {
        parsed = JSON.parse(raw);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Invalid extracted JSON for ${sourceId} at ${path}: ${message}`);
    }

    return SourceRecordSchema.array().parse(parsed);
}

export async function transformCommand(): Promise<{ paths: string[]; sourceCount: number; recordCount: number }> {
    const config = loadConfig();
    const registryPath = await resolveSourceRegistryPath();
    const registry = await loadSourceRegistry(registryPath);
    const baseDir = dirname(registryPath);
    const outputDir = resolve(baseDir, config.EFA_OUTPUT_DIR);

    const allSourceRecords: SourceRecord[] = [];
    for (const source of registry.sources) {
        const records = await readExtractedRecords(outputDir, source.id);
        allSourceRecords.push(...records);
    }

    const transformed = transformExtractedRecords(allSourceRecords);
    const normalizedDir = resolve(outputDir, 'normalized');

    const runesPath = resolve(normalizedDir, 'runes.json');
    const deitiesPath = resolve(normalizedDir, 'deities.json');
    const worldsPath = resolve(normalizedDir, 'worlds.json');
    const practicesPath = resolve(normalizedDir, 'practices.records.json');
    const adjacentPath = resolve(normalizedDir, 'adjacent-systems.records.json');

    await writeJson(runesPath, transformed.runes);
    await writeJson(deitiesPath, transformed.deities);
    await writeJson(worldsPath, transformed.worlds);
    await writeJson(practicesPath, transformed.practices);
    await writeJson(adjacentPath, transformed.adjacentSystems);

    return {
        paths: [runesPath, deitiesPath, worldsPath, practicesPath, adjacentPath],
        sourceCount: registry.sources.length,
        recordCount: allSourceRecords.length
    };
}
