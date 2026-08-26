import type { SourceRecord } from '@efa/schemas';
import { buildGenericPageRecord, type ExtractorContext } from '../common/page-extractor.js';

export function runesExtractor(html: string, context: ExtractorContext): SourceRecord[] {
    return buildGenericPageRecord(html, context, 'rune_source');
}
