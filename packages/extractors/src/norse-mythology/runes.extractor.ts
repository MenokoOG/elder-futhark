import type { SourceRecord } from '@efa/schemas';
import { buildGenericPageRecord, type ExtractorContext } from '../common/page-extractor.js';

/**
 * The prose articles in the /runes/ section — origins, philosophy and magic,
 * the book list. They are pages *about* runes, not definitions of runes, so
 * they are emitted as generic pages.
 *
 * Emitting them as `rune_source` is what put four records named "The Meanings
 * Of The Runes", "The Origins Of The Runes", "Runic Philosophy And Magic" and
 * "The Best Books On The Runes" into the published rune dataset, each with a
 * glyph taken from the first letter of its own page title.
 *
 * The page that actually defines the twenty-four runes is handled by
 * `elderFutharkExtractor`.
 */
export function runesExtractor(html: string, context: ExtractorContext): SourceRecord[] {
    return buildGenericPageRecord(html, context, 'generic_page');
}
