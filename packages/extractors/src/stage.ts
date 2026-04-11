import type { SourceConfig } from '@efa/config';
import { SourceRecordSchema, type SourceRecord } from '@efa/schemas';
import { bindrunesExtractor } from './andrea-shelley/bindrunes.extractor.js';
import { futharkRunesExtractor } from './andrea-shelley/futhark-runes.extractor.js';
import { icelandicStavesExtractor } from './andrea-shelley/icelandic-staves.extractor.js';
import { runeCastingExtractor } from './andrea-shelley/rune-casting.extractor.js';
import type { ExtractorContext } from './common/page-extractor.js';
import { godsExtractor } from './norse-mythology/gods.extractor.js';
import { runesExtractor } from './norse-mythology/runes.extractor.js';
import { worldsExtractor } from './norse-mythology/worlds.extractor.js';

export interface RawSnapshotInput {
    sourceId: string;
    html: string;
    fetchedAt: string;
    contentHash: string;
}

export interface ExtractStageInput {
    source: SourceConfig;
    snapshot: RawSnapshotInput;
}

export function extractSourceRecords(input: ExtractStageInput): SourceRecord[] {
    const context: ExtractorContext = {
        sourceId: input.source.id,
        sourceUrl: input.source.url,
        classification: input.source.classification,
        fetchedAt: input.snapshot.fetchedAt,
        contentHash: input.snapshot.contentHash
    };

    let records: SourceRecord[];
    switch (input.source.id) {
        case 'norse-gods':
            records = godsExtractor(input.snapshot.html, context);
            break;
        case 'norse-worlds':
            records = worldsExtractor(input.snapshot.html, context);
            break;
        case 'norse-runes':
            records = runesExtractor(input.snapshot.html, context);
            break;
        case 'shelley-rune-casting':
            records = runeCastingExtractor(input.snapshot.html, context);
            break;
        case 'shelley-futhark':
            records = futharkRunesExtractor(input.snapshot.html, context);
            break;
        case 'shelley-bindrunes':
            records = bindrunesExtractor(input.snapshot.html, context);
            break;
        case 'shelley-staves':
            records = icelandicStavesExtractor(input.snapshot.html, context);
            break;
        default:
            throw new Error(`No extractor configured for source id: ${input.source.id}`);
    }

    const parsed = SourceRecordSchema.array().safeParse(records);
    if (!parsed.success) {
        throw new Error(`Extractor output validation failed for ${input.source.id}: ${parsed.error.message}`);
    }

    return parsed.data;
}
