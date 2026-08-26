import type { SourceRecord } from '@efa/schemas';
import { buildGenericPageRecord, type ExtractorContext } from '../common/page-extractor.js';

export function icelandicStavesExtractor(html: string, context: ExtractorContext): SourceRecord[] {
    return buildGenericPageRecord(html, context, 'adjacent_source');
}
