import type { SourceRecord } from '@efa/schemas';
import { loadHtml } from '../common/html.js';
import { cleanText } from '../common/text-clean.js';
import type { ExtractorContext } from '../common/page-extractor.js';

/**
 * Extracts the twenty-four Elder Futhark runes from norse-mythology.org's
 * "The Meanings of the Runes".
 *
 * Each rune is one paragraph carrying a titled image and a labelled sentence:
 *
 *   <p><a href=".../Fehu.png"><img title="Fehu" /></a>
 *      Name: Fehu, "cattle." Phoneme: F. Meaning: wealth.</p>
 *
 * The image title is the identifier — it stays stable even where the prose
 * says "Name: unknown", which the page does for two runes whose names the rune
 * poems do not agree on. Those are carried through as unknown rather than
 * filled in: the standing rule is that conflicting interpretations are never
 * flattened into one unqualified claim.
 *
 * The rune row is a fixed, closed set of twenty-four. Anything else means the
 * page changed shape, so this throws rather than publishing a short row.
 */

const EXPECTED_RUNE_COUNT = 24;
const EXTRACTOR_VERSION = '0.2.0';

interface ParsedEntry {
    imageTitle: string;
    attestedName: string;
    phoneme: string;
    meaning: string;
}

/** Pull the text between one label and the next, or null when absent. */
function segmentBetween(text: string, start: RegExp, end: RegExp): string | null {
    const startMatch = start.exec(text);
    if (!startMatch) {
        return null;
    }

    const from = startMatch.index + startMatch[0].length;
    const rest = text.slice(from);
    const endMatch = end.exec(rest);
    const segment = endMatch ? rest.slice(0, endMatch.index) : rest;
    return cleanText(segment);
}

function parseEntry(imageTitle: string, text: string): ParsedEntry | null {
    // "Name:" is sometimes written without a following space.
    const nameSegment = segmentBetween(text, /Name:\s*/i, /\s*Phoneme:/i);
    const phonemeSegment = segmentBetween(text, /Phoneme:\s*/i, /\s*Meaning:/i);
    const meaningSegment = segmentBetween(text, /Meaning:\s*/i, /$(?!\n)/);

    if (nameSegment === null || phonemeSegment === null || meaningSegment === null) {
        return null;
    }

    return {
        imageTitle: cleanText(imageTitle),
        attestedName: stripTrailingStop(nameSegment),
        phoneme: stripTrailingStop(phonemeSegment),
        meaning: stripTrailingStop(meaningSegment)
    };
}

function stripTrailingStop(value: string): string {
    return value.replace(/[.\s]+$/u, '').trim();
}

export function elderFutharkExtractor(html: string, context: ExtractorContext): SourceRecord[] {
    const $ = loadHtml(html);
    const entries: ParsedEntry[] = [];

    $('p').each((_, element) => {
        const paragraph = $(element);
        const image = paragraph.find('img[title]').first();
        if (image.length === 0) {
            return;
        }

        const title = image.attr('title');
        if (!title) {
            return;
        }

        const parsed = parseEntry(title, cleanText(paragraph.text()));
        if (parsed) {
            entries.push(parsed);
        }
    });

    if (entries.length !== EXPECTED_RUNE_COUNT) {
        throw new Error(
            `Elder Futhark extraction for ${context.sourceId} produced ${entries.length} runes, expected ` +
                `${EXPECTED_RUNE_COUNT}. The rune row is a closed set, so this is selector drift on ` +
                `${context.sourceUrl} rather than a content change. Refusing to publish a partial row.`
        );
    }

    const sourceSite = new URL(context.sourceUrl).hostname;
    const pageTitle = cleanText($('title').first().text()) || context.sourceId;

    return entries.map((entry) => ({
        id: `${context.sourceId}:${entry.imageTitle.toLowerCase()}`,
        kind: 'rune_source' as const,
        title: entry.imageTitle,
        summary: entry.meaning,
        sections: [
            { heading: 'attested-name', text: entry.attestedName },
            { heading: 'phoneme', text: entry.phoneme },
            { heading: 'meaning', text: entry.meaning }
        ],
        references: [
            {
                sourceSite,
                sourceUrl: context.sourceUrl,
                sourceTitle: pageTitle,
                extractedAt: context.fetchedAt,
                extractorVersion: EXTRACTOR_VERSION,
                contentHash: context.contentHash,
                classification: context.classification
            }
        ],
        tags: []
    }));
}
