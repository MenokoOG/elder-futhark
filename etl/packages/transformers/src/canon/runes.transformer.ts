import { RuneSchema, type Rune, type SourceRecord } from '@efa/schemas';
import { aliasFromSourceUrl, displayNameFromSourceUrl, resolveAlias } from '../merge/alias-resolution.js';
import { baselineConfidence } from '../quality/score.js';

export function runes(records: SourceRecord[]): Rune[] {
    const sourceRecords = records.filter((record) => record.kind === 'rune_source');

    const mapped = sourceRecords.map((record) => {
        const primarySourceUrl = record.references[0]?.sourceUrl ?? '';
        const displayName = displayNameFromSourceUrl(record.title, primarySourceUrl);
        const canonicalId = primarySourceUrl ? aliasFromSourceUrl(primarySourceUrl, displayName) : resolveAlias(displayName);
        const classification = record.references[0]?.classification;
        const notes = record.sections.map((section) => section.text).filter((text) => text.length > 0);

        const rune: Rune = {
            id: canonicalId,
            glyph: displayName.slice(0, 1) || '?',
            name: displayName,
            phonetic: [],
            coreMeanings: notes.slice(0, 8),
            historicalNotes: classification === 'reference_like' ? notes : [],
            interpretiveNotes: classification !== 'reference_like' ? notes : [],
            keywords: record.tags,
            sources: record.references,
            confidence: classification === 'reference_like' ? Math.min(1, baselineConfidence() + 0.1) : baselineConfidence()
        };

        return RuneSchema.parse(rune);
    });

    return dedupeById(mapped);
}

function dedupeById(items: Rune[]): Rune[] {
    const byId = new Map<string, Rune>();

    for (const item of items) {
        const existing = byId.get(item.id);
        if (!existing) {
            byId.set(item.id, item);
            continue;
        }

        byId.set(item.id, {
            ...existing,
            coreMeanings: unique([...existing.coreMeanings, ...item.coreMeanings]),
            historicalNotes: unique([...existing.historicalNotes, ...item.historicalNotes]),
            interpretiveNotes: unique([...existing.interpretiveNotes, ...item.interpretiveNotes]),
            keywords: unique([...existing.keywords, ...item.keywords]),
            sources: uniqueSources([...existing.sources, ...item.sources]),
            confidence: Math.max(existing.confidence, item.confidence)
        });
    }

    return [...byId.values()];
}

function unique(items: string[]): string[] {
    return [...new Set(items)];
}

function uniqueSources(sources: Rune['sources']): Rune['sources'] {
    const seen = new Set<string>();
    const result: Rune['sources'] = [];

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
