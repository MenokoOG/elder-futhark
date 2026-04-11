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

function normalizeUrl(rawUrl: string): string {
    const url = new URL(rawUrl);
    url.hash = '';
    url.search = '';
    url.protocol = 'https:';
    return url.toString();
}

function discoverPertinentSubpages(source: SourceConfig, html: string): string[] {
    if (!['norse-gods', 'norse-worlds', 'norse-runes'].includes(source.id)) {
        return [];
    }

    const discovered = new Set<string>();
    const matches = [...html.matchAll(/href=["']([^"'#?]+)["']/gi)].map((match) => match[1]);

    for (const candidate of matches) {
        if (!candidate || !candidate.startsWith('http')) {
            continue;
        }

        let url: URL;
        try {
            url = new URL(candidate);
        } catch {
            continue;
        }

        if (url.hostname !== 'norse-mythology.org') {
            continue;
        }

        const path = url.pathname.replace(/\/+$/, '/');

        if (source.id === 'norse-runes') {
            if (path.startsWith('/runes/') && path !== '/runes/' && path !== '/runes/the-meanings-of-the-runes/') {
                discovered.add(normalizeUrl(url.toString()));
            }
            continue;
        }

        if (source.id === 'norse-worlds') {
            if (path.startsWith('/cosmology/the-nine-worlds/') && path !== '/cosmology/the-nine-worlds/') {
                discovered.add(normalizeUrl(url.toString()));
            }
            continue;
        }

        if (source.id === 'norse-gods') {
            if (path.startsWith('/gods-and-creatures/') && path.split('/').filter(Boolean).length >= 4) {
                discovered.add(normalizeUrl(url.toString()));
            }
        }
    }

    return [...discovered].sort();
}

async function assertTopicSubpageCoverage(selectedSources: SourceConfig[], outputDir: string, registrySources: SourceConfig[]): Promise<void> {
    const registryUrls = new Set(registrySources.map((source) => normalizeUrl(source.url)));
    const missing = new Map<string, string[]>();

    for (const source of selectedSources) {
        if (!['norse-gods', 'norse-worlds', 'norse-runes'].includes(source.id)) {
            continue;
        }

        const snapshot = await readSnapshotPair(outputDir, source.id);
        const discovered = discoverPertinentSubpages(source, snapshot.html);
        const absent = discovered.filter((url) => !registryUrls.has(url));

        if (absent.length > 0) {
            missing.set(source.id, absent);
        }
    }

    if (missing.size === 0) {
        return;
    }

    const details = [...missing.entries()]
        .map(([sourceId, urls]) => `${sourceId}:\n- ${urls.join('\n- ')}`)
        .join('\n\n');

    throw new Error(
        `Registry is missing pertinent topic subpages required for extraction coverage. Add these URLs to SOURCE_REGISTRY.json and docs/sources/source-catalog.md before running extract:\n\n${details}`
    );
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

    if (options.source === 'all') {
        await assertTopicSubpageCoverage(selectedSources, outputDir, registry.sources);
    }

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
