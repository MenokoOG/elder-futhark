import type { SourceRecord } from '@efa/schemas';

export interface PracticeBuckets {
    practices: SourceRecord[];
    adjacentSystems: SourceRecord[];
}

export function practices(records: SourceRecord[]): PracticeBuckets {
    return {
        practices: records.filter((record) => record.kind === 'practice_source'),
        adjacentSystems: records.filter((record) => record.kind === 'adjacent_source')
    };
}
