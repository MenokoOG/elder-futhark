import { RuneSchema, type Rune, type SourceRecord } from '@efa/schemas';
import { baselineConfidence } from '../quality/score.js';
import { requireCanonicalRune } from './elder-futhark.js';

export function runes(records: SourceRecord[]): Rune[] {
    const sourceRecords = records.filter((record) => record.kind === 'rune_source');

    const mapped = sourceRecords.map((record) => {
        // Identity comes from the canonical table, never from the page title.
        // Deriving the glyph from the title's first letter is what produced
        // runes named "The Meanings Of The Runes" with the glyph "T".
        const canonical = requireCanonicalRune(record.title, `record ${record.id}`);
        const classification = record.references[0]?.classification;

        const attestedName = sectionText(record, 'attested-name');
        const phoneme = sectionText(record, 'phoneme');
        const meaning = sectionText(record, 'meaning') || record.summary || '';

        // "unknown" is a real answer here — the rune poems disagree on two of
        // the names — so it is carried through rather than filled in.
        const notes: string[] = [];
        if (attestedName) {
            notes.push(`Attested name: ${attestedName}`);
        }

        const rune: Rune = {
            id: canonical.key,
            glyph: canonical.glyph,
            name: titleCase(canonical.key),
            phonetic: phoneme ? [phoneme] : [],
            coreMeanings: splitMeanings(meaning),
            historicalNotes: classification === 'reference_like' ? notes : [],
            interpretiveNotes: classification !== 'reference_like' ? notes : [],
            keywords: record.tags,
            sources: record.references,
            confidence:
                classification === 'reference_like' ? Math.min(1, baselineConfidence() + 0.1) : baselineConfidence()
        };

        return RuneSchema.parse(rune);
    });

    return dedupeById(mapped);
}

function sectionText(record: SourceRecord, heading: string): string {
    return record.sections.find((section) => section.heading === heading)?.text.trim() ?? '';
}

/** "danger, suffering" -> ["danger", "suffering"]; leaves qualified prose intact. */
function splitMeanings(meaning: string): string[] {
    const trimmed = meaning.trim();
    if (trimmed.length === 0) {
        return [];
    }

    // Only split a plain comma list. Anything carrying a parenthetical or a
    // sentence stays whole, so a hedge like "unknown (the rune poems are
    // ambiguous)" is never chopped into fragments that read as separate claims.
    if (/[()]/.test(trimmed) || /\.\s/.test(trimmed)) {
        return [trimmed];
    }

    return trimmed
        .split(',')
        .map((part) => part.trim())
        .filter((part) => part.length > 0);
}

function titleCase(key: string): string {
    return key.charAt(0).toUpperCase() + key.slice(1);
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
