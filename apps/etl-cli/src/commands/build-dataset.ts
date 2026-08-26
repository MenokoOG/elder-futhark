import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import {
    DatasetManifestSchema,
    DatasetSchema,
    DeitySchema,
    RuneSchema,
    WorldSchema,
    type Dataset,
    type DatasetManifest,
    type Deity,
    type Rune,
    type World
} from '@efa/schemas';
import { loadConfig, loadSourceRegistry, resolveSourceRegistryPath } from '@efa/config';
import { writeJson } from '@efa/storage';

const DATASET_VERSION = '0.1.0';

export interface BuildDatasetResult {
    manifest: DatasetManifest;
    paths: string[];
}

async function readJson(path: string): Promise<unknown> {
    let raw: string;
    try {
        raw = await readFile(path, 'utf8');
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to read required input at ${path}: ${message}`);
    }

    try {
        return JSON.parse(raw);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Invalid JSON in ${path}: ${message}`);
    }
}

export async function buildDatasetCommand(): Promise<BuildDatasetResult> {
    const config = loadConfig();
    const registryPath = await resolveSourceRegistryPath();
    const registry = await loadSourceRegistry(registryPath);

    const baseDir = dirname(registryPath);
    const outputDir = resolve(baseDir, config.EFA_OUTPUT_DIR);
    const normalizedDir = resolve(outputDir, 'normalized');
    const publishedDir = resolve(outputDir, 'published');

    const runes = RuneSchema.array().parse(await readJson(resolve(normalizedDir, 'runes.json'))) as Rune[];
    const deities = DeitySchema.array().parse(await readJson(resolve(normalizedDir, 'deities.json'))) as Deity[];
    const worlds = WorldSchema.array().parse(await readJson(resolve(normalizedDir, 'worlds.json'))) as World[];

    const manifest = DatasetManifestSchema.parse({
        version: DATASET_VERSION,
        builtAt: new Date().toISOString(),
        sourceCount: registry.sources.length,
        recordCount: runes.length + deities.length + worlds.length
    });

    const dataset = DatasetSchema.parse({
        manifest,
        runes,
        deities,
        worlds
    } satisfies Dataset);

    const datasetPath = resolve(publishedDir, 'dataset.json');
    const runesPath = resolve(publishedDir, 'runes.json');
    const deitiesPath = resolve(publishedDir, 'deities.json');
    const worldsPath = resolve(publishedDir, 'worlds.json');
    const metadataPath = resolve(publishedDir, 'metadata.json');

    await writeJson(datasetPath, dataset);
    await writeJson(runesPath, dataset.runes);
    await writeJson(deitiesPath, dataset.deities);
    await writeJson(worldsPath, dataset.worlds);
    await writeJson(metadataPath, dataset.manifest);

    return {
        manifest: dataset.manifest,
        paths: [datasetPath, runesPath, deitiesPath, worldsPath, metadataPath]
    };
}
