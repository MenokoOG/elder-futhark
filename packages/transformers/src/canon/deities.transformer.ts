import { DeitySchema, type Deity, type SourceRecord } from '@efa/schemas';
import { aliasFromSourceUrl, displayNameFromSourceUrl, resolveAlias } from '../merge/alias-resolution.js';
import { baselineConfidence } from '../quality/score.js';

export function deities(records: SourceRecord[]): Deity[] {
    const sourceRecords = records.filter((record) => record.kind === 'deity_source');

    const mapped = sourceRecords.map((record) => {
        const primarySourceUrl = record.references[0]?.sourceUrl ?? '';
        const name = displayNameFromSourceUrl(record.title, primarySourceUrl);
        const id = primarySourceUrl ? aliasFromSourceUrl(primarySourceUrl, name) : resolveAlias(name);

        return DeitySchema.parse({
            id,
            name,
            aliases: [],
            // Not record.tags. Tags used to carry the source classification,
            // which made every deity come out with domains: ["reference_like"].
            // No source is parsed for domains yet, so this is honestly empty
            // until an extractor produces them.
            domains: [],
            description: record.summary ?? record.sections[0]?.text ?? '',
            sources: record.references,
            confidence: baselineConfidence()
        } satisfies Deity);
    });

    return dedupeById(mapped);
}

function dedupeById(items: Deity[]): Deity[] {
    const byId = new Map<string, Deity>();

    for (const item of items) {
        const existing = byId.get(item.id);
        if (!existing) {
            byId.set(item.id, item);
            continue;
        }

        byId.set(item.id, {
            ...existing,
            aliases: unique([...existing.aliases, ...item.aliases]),
            domains: unique([...existing.domains, ...item.domains]),
            description: existing.description || item.description,
            sources: uniqueSources([...existing.sources, ...item.sources]),
            confidence: Math.max(existing.confidence, item.confidence)
        });
    }

    return [...byId.values()];
}

function unique(items: string[]): string[] {
    return [...new Set(items)];
}

function uniqueSources(sources: Deity['sources']): Deity['sources'] {
    const seen = new Set<string>();
    const result: Deity['sources'] = [];

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
