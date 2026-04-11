import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { loadConfig, loadSourceRegistry, resolveSourceRegistryPath, type SourceConfig } from '@efa/config';
import { extractSourceRecords } from '@efa/extractors';
import { writeJson } from '@efa/storage';

interface RawSnapshotMetadata {
    sourceId: string;
    fetchedAt: string;
    contentHash: string;
}

export interface ExtractCommandOptions {
    source: string;
}

function selectSources(sourceArg: string, sources: SourceConfig[]): SourceConfig[] {
    if (sourceArg === 'all') {
        return sources;
    }

    const selected = sources.find((source) => source.id === sourceArg);
    if (!selected) {
        throw new Error(`Unknown source id: ${sourceArg}`);
    }

    return [selected];
}

async function readSnapshotPair(outputDir: string, sourceId: string): Promise<{ html: string; metadata: RawSnapshotMetadata }> {
    const rawDir = resolve(outputDir, 'raw');
    const htmlPath = resolve(rawDir, `${sourceId}.html`);
    const metadataPath = resolve(rawDir, `${sourceId}.metadata.json`);

    let html: string;
    try {
        html = await readFile(htmlPath, 'utf8');
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Missing raw snapshot HTML for ${sourceId} at ${htmlPath}: ${message}`);
    }

    let metadataRaw: string;
    try {
        metadataRaw = await readFile(metadataPath, 'utf8');
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Missing raw snapshot metadata for ${sourceId} at ${metadataPath}: ${message}`);
    }

    let metadata: RawSnapshotMetadata;
    try {
        metadata = JSON.parse(metadataRaw) as RawSnapshotMetadata;
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Invalid raw snapshot metadata JSON for ${sourceId} at ${metadataPath}: ${message}`);
    }

    if (!metadata.fetchedAt || !metadata.contentHash) {
        throw new Error(`Invalid raw snapshot metadata for ${sourceId}: fetchedAt and contentHash are required`);
    }

    return { html, metadata };
}

export async function extractCommand(options: ExtractCommandOptions): Promise<{ count: number; paths: string[] }> {
    const config = loadConfig();
    const registryPath = await resolveSourceRegistryPath();
    const registry = await loadSourceRegistry(registryPath);
    const baseDir = dirname(registryPath);
    const outputDir = resolve(baseDir, config.EFA_OUTPUT_DIR);

    const selectedSources = selectSources(options.source, registry.sources);
    const extractedDir = resolve(outputDir, 'extracted');

    const paths: string[] = [];
    for (const source of selectedSources) {
        const snapshot = await readSnapshotPair(outputDir, source.id);
        const records = extractSourceRecords({
            source,
            snapshot: {
                sourceId: source.id,
                html: snapshot.html,
                fetchedAt: snapshot.metadata.fetchedAt,
                contentHash: snapshot.metadata.contentHash
            }
        });

        if (records.length === 0) {
            throw new Error(`Extractor emitted zero records for source ${source.id}`);
        }

        const path = resolve(extractedDir, `${source.id}.records.json`);
        await writeJson(path, records);
        paths.push(path);
    }

    return {
        count: selectedSources.length,
        paths
    };
}
