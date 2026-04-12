import { describe, expect, it } from 'vitest';
import { buildPreviewHtml, type PreviewSummary } from './preview-server.js';

describe('buildPreviewHtml', () => {
    it('renders key counts and file names', () => {
        const summary: PreviewSummary = {
            generatedAt: '2026-04-11T00:00:00.000Z',
            rawCount: 7,
            extractedCount: 7,
            normalizedCounts: {
                runes: 24,
                deities: 12,
                worlds: 9,
                practices: 3,
                adjacentSystems: 2
            },
            files: {
                raw: ['norse-runes.raw.txt', 'norse-runes.metadata.json'],
                extracted: ['norse-runes.records.json'],
                normalized: ['runes.json', 'deities.json', 'worlds.json']
            }
        };

        const html = buildPreviewHtml(summary);

        expect(html).toContain('Elder Futhark ETL Preview');
        expect(html).toContain('Raw Sources');
        expect(html).toContain('norse-runes.records.json');
        expect(html).toContain('2026-04-11T00:00:00.000Z');
        expect(html).toContain("document.getElementById('generated').textContent");
    });
});
