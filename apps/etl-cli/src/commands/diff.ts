import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { loadConfig, resolveSourceRegistryPath } from '@efa/config';

interface EntityWithId {
    id: string;
    [key: string]: unknown;
}

export interface CollectionDiffSummary {
    collection: 'runes' | 'deities' | 'worlds';
    normalizedCount: number;
    publishedCount: number;
    added: string[];
    removed: string[];
    changed: string[];
    unchangedCount: number;
}

export interface DiffCommandResult {
    hasChanges: boolean;
    collections: CollectionDiffSummary[];
}

const COLLECTIONS = ['runes', 'deities', 'worlds'] as const;

function stableStringify(value: unknown): string {
    if (Array.isArray(value)) {
        return `[${value.map((item) => stableStringify(item)).join(',')}]`;
    }

    if (value && typeof value === 'object') {
        const entries = Object.entries(value as Record<string, unknown>).sort(([left], [right]) =>
            left.localeCompare(right)
        );
        return `{${entries
            .map(([key, entryValue]) => `${JSON.stringify(key)}:${stableStringify(entryValue)}`)
            .join(',')}}`;
    }

    return JSON.stringify(value);
}

function toEntityMap(entries: unknown, label: string): Map<string, EntityWithId> {
    if (!Array.isArray(entries)) {
        throw new Error(`${label} is not a JSON array`);
    }

    const map = new Map<string, EntityWithId>();

    for (const item of entries) {
        if (!item || typeof item !== 'object') {
            throw new Error(`${label} contains a non-object entry`);
        }

        const id = (item as { id?: unknown }).id;
        if (typeof id !== 'string' || id.trim().length === 0) {
            throw new Error(`${label} contains an entry without a valid id`);
        }

        if (map.has(id)) {
            throw new Error(`${label} contains duplicate id: ${id}`);
        }

        map.set(id, item as EntityWithId);
    }

    return map;
}

async function readJson(filePath: string): Promise<unknown> {
    const raw = await readFile(filePath, 'utf8');
    return JSON.parse(raw) as unknown;
}

export async function diffCommand(): Promise<DiffCommandResult> {
    const config = loadConfig();
    const registryPath = await resolveSourceRegistryPath();
    const baseDir = dirname(registryPath);
    const dataDir = resolve(baseDir, config.EFA_OUTPUT_DIR);

    const collections: CollectionDiffSummary[] = [];

    for (const collection of COLLECTIONS) {
        const normalizedPath = resolve(dataDir, 'normalized', `${collection}.json`);
        const publishedPath = resolve(dataDir, 'published', `${collection}.json`);

        const normalizedEntries = await readJson(normalizedPath);
        const publishedEntries = await readJson(publishedPath);

        const normalized = toEntityMap(normalizedEntries, normalizedPath);
        const published = toEntityMap(publishedEntries, publishedPath);

        const added: string[] = [];
        const removed: string[] = [];
        const changed: string[] = [];

        for (const id of normalized.keys()) {
            if (!published.has(id)) {
                added.push(id);
            }
        }

        for (const id of published.keys()) {
            if (!normalized.has(id)) {
                removed.push(id);
            }
        }

        for (const [id, normalizedValue] of normalized.entries()) {
            const publishedValue = published.get(id);
            if (!publishedValue) {
                continue;
            }

            if (stableStringify(normalizedValue) !== stableStringify(publishedValue)) {
                changed.push(id);
            }
        }

        const unchangedCount = normalized.size - added.length - changed.length;

        collections.push({
            collection,
            normalizedCount: normalized.size,
            publishedCount: published.size,
            added: added.sort((left, right) => left.localeCompare(right)),
            removed: removed.sort((left, right) => left.localeCompare(right)),
            changed: changed.sort((left, right) => left.localeCompare(right)),
            unchangedCount
        });
    }

    const hasChanges = collections.some(
        (collection) => collection.added.length > 0 || collection.removed.length > 0 || collection.changed.length > 0
    );

    return {
        hasChanges,
        collections
    };
}
