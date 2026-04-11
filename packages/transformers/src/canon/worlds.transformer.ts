import { WorldSchema, type SourceRecord, type World } from '@efa/schemas';
import { aliasFromSourceUrl, displayNameFromSourceUrl, resolveAlias } from '../merge/alias-resolution.js';
import { baselineConfidence } from '../quality/score.js';

export function worlds(records: SourceRecord[]): World[] {
    const sourceRecords = records.filter((record) => record.kind === 'world_source');

    const mapped = sourceRecords.map((record) => {
        const primarySourceUrl = record.references[0]?.sourceUrl ?? '';
        const name = displayNameFromSourceUrl(record.title, primarySourceUrl);
        const id = primarySourceUrl ? aliasFromSourceUrl(primarySourceUrl, name) : resolveAlias(name);

        return WorldSchema.parse({
            id,
            name,
            summary: record.summary ?? record.sections[0]?.text ?? '',
            associations: record.tags,
            sources: record.references,
            confidence: baselineConfidence()
        } satisfies World);
    });

    return dedupeById(mapped);
}

function dedupeById(items: World[]): World[] {
    const byId = new Map<string, World>();

    for (const item of items) {
        const existing = byId.get(item.id);
        if (!existing) {
            byId.set(item.id, item);
            continue;
        }

        byId.set(item.id, {
            ...existing,
            summary: existing.summary || item.summary,
            associations: unique([...existing.associations, ...item.associations]),
            sources: uniqueSources([...existing.sources, ...item.sources]),
            confidence: Math.max(existing.confidence, item.confidence)
        });
    }

    return [...byId.values()];
}

function unique(items: string[]): string[] {
    return [...new Set(items)];
}

function uniqueSources(sources: World['sources']): World['sources'] {
    const seen = new Set<string>();
    const result: World['sources'] = [];

    for (const source of sources) {
        const key = `${source.sourceUrl}|${source.contentHash}`;
        if (seen.has(key)) {
            continue;
        }
        seen.add(key);
        result.push(source);
    }

    return result;
}
