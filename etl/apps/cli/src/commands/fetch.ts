import { dirname, resolve } from 'node:path';
import {
    loadConfig,
    loadSourceRegistry,
    resolveSourceRegistryPath,
    type SourceConfig
} from '@efa/config';
import { fetchSources } from '@efa/fetcher';
import { writeRawSnapshot } from '@efa/storage';

export interface FetchCommandOptions {
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

export async function fetchCommand(options: FetchCommandOptions): Promise<{ count: number; paths: string[] }> {
    const config = loadConfig();
    const registryPath = await resolveSourceRegistryPath();
    const registry = await loadSourceRegistry(registryPath);
    const baseDir = dirname(registryPath);
    const outputDir = resolve(baseDir, config.EFA_OUTPUT_DIR);
    const selectedSources = selectSources(options.source, registry.sources);

    const fetchedSnapshots = await fetchSources(selectedSources, {
        userAgent: config.EFA_USER_AGENT,
        delayMs: config.EFA_FETCH_DELAY_MS
    });

    const writtenPaths: string[] = [];
    for (const snapshot of fetchedSnapshots) {
        const persisted = await writeRawSnapshot(outputDir, snapshot);
        writtenPaths.push(persisted.htmlPath, persisted.metadataPath);
    }

    return {
        count: fetchedSnapshots.length,
        paths: writtenPaths
    };
}
