import type { SourceRecord } from '@efa/schemas';
import { cleanText } from './text-clean.js';
import { loadHtml } from './html.js';

export type SourceKind = SourceRecord['kind'];

export interface SourceReferenceInput {
    sourceSite: string;
    sourceUrl: string;
    sourceTitle?: string;
    extractedAt: string;
    extractorVersion: string;
    contentHash: string;
    classification: SourceRecord['references'][number]['classification'];
}

export interface ExtractorContext {
    sourceId: string;
    sourceUrl: string;
    classification: SourceRecord['references'][number]['classification'];
    fetchedAt: string;
    contentHash: string;
}

export function buildGenericPageRecord(html: string, context: ExtractorContext, kind: SourceKind): SourceRecord[] {
    const $ = loadHtml(html);
    const pageTitle = cleanText($('h1').first().text() || $('title').first().text() || context.sourceId);

    const sectionTexts = $('main p, article p, p')
        .map((_, el) => cleanText($(el).text()))
        .get()
        .filter((text) => text.length > 0)
        .slice(0, 30);

    if (sectionTexts.length === 0) {
        throw new Error(`Extractor produced no paragraph content for source ${context.sourceId}`);
    }

    const sourceSite = new URL(context.sourceUrl).hostname;
    const summary = sectionTexts[0];

    return [
        {
            id: `${context.sourceId}:page`,
            kind,
            title: pageTitle,
            summary,
            sections: sectionTexts.map((text) => ({ text })),
            references: [
                {
                    sourceSite,
                    sourceUrl: context.sourceUrl,
                    sourceTitle: pageTitle,
                    extractedAt: context.fetchedAt,
                    extractorVersion: '0.1.0',
                    contentHash: context.contentHash,
                    classification: context.classification
                }
            ],
            tags: [context.classification]
        }
    ];
}
