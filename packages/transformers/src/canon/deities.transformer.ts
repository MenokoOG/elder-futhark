import { DeitySchema, type Deity, type SourceRecord } from '@efa/schemas';
import { resolveAlias } from '../merge/alias-resolution.js';
import { baselineConfidence } from '../quality/score.js';

export function deities(records: SourceRecord[]): Deity[] {
    const sourceRecords = records.filter((record) => record.kind === 'deity_source');

    return sourceRecords.map((record) =>
        DeitySchema.parse({
            id: resolveAlias(record.title),
            name: record.title,
            aliases: [],
            domains: record.tags,
            description: record.summary ?? record.sections[0]?.text ?? '',
            sources: record.references,
            confidence: baselineConfidence()
        } satisfies Deity)
    );
}
