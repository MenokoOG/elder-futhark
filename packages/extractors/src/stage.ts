import type { SourceConfig } from '@efa/config';
import { SourceRecordSchema, type SourceRecord } from '@efa/schemas';
import { bindrunesExtractor } from './andrea-shelley/bindrunes.extractor.js';
import { futharkRunesExtractor } from './andrea-shelley/futhark-runes.extractor.js';
import { icelandicStavesExtractor } from './andrea-shelley/icelandic-staves.extractor.js';
import { runeCastingExtractor } from './andrea-shelley/rune-casting.extractor.js';
import type { ExtractorContext } from './common/page-extractor.js';
import { elderFutharkExtractor } from './norse-mythology/elder-futhark.extractor.js';
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

    const records = selectExtractor(input.source.id, input.source.url)(input.snapshot.html, context);

    const parsed = SourceRecordSchema.array().safeParse(records);
    if (!parsed.success) {
        throw new Error(`Extractor output validation failed for ${input.source.id}: ${parsed.error.message}`);
    }

    return parsed.data;
}

function selectExtractor(sourceId: string, sourceUrl: string) {
    if (sourceId === 'shelley-rune-casting') {
        return runeCastingExtractor;
    }

    if (sourceId === 'shelley-futhark') {
        return futharkRunesExtractor;
    }

    if (sourceId === 'shelley-bindrunes') {
        return bindrunesExtractor;
    }

    if (sourceId === 'shelley-staves') {
        return icelandicStavesExtractor;
    }

    // The meanings page is the only one that defines the rune row itself.
    // Every other /runes/ page is prose about runes.
    if (sourceId === 'norse-runes') {
        return elderFutharkExtractor;
    }

    if (sourceId.startsWith('norse-runes')) {
        return runesExtractor;
    }

    if (sourceId.startsWith('norse-world')) {
        return worldsExtractor;
    }

    if (sourceId.startsWith('norse-god') || sourceId.startsWith('norse-giant') || sourceId === 'norse-gods') {
        return godsExtractor;
    }

    if (sourceUrl.includes('/runes/')) {
        return runesExtractor;
    }

    if (sourceUrl.includes('/cosmology/the-nine-worlds/')) {
        return worldsExtractor;
    }

    if (sourceUrl.includes('/gods-and-creatures/')) {
        return godsExtractor;
    }

    throw new Error(`No extractor configured for source id: ${sourceId}`);
}
