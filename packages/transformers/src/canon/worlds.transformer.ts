import { WorldSchema, type SourceRecord, type World } from '@efa/schemas';
import { resolveAlias } from '../merge/alias-resolution.js';
import { baselineConfidence } from '../quality/score.js';

export function worlds(records: SourceRecord[]): World[] {
    const sourceRecords = records.filter((record) => record.kind === 'world_source');

    return sourceRecords.map((record) =>
        WorldSchema.parse({
            id: resolveAlias(record.title),
            name: record.title,
            summary: record.summary ?? record.sections[0]?.text ?? '',
            associations: record.tags,
            sources: record.references,
            confidence: baselineConfidence()
        } satisfies World)
    );
}
