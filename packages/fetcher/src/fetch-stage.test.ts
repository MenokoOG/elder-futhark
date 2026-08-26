import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('./client.js', () => ({
    fetchHtml: vi.fn()
}));

vi.mock('./retry.js', async (importOriginal) => {
    const actual = await importOriginal<typeof import('./retry.js')>();
    return {
        ...actual,
        withRetry: vi.fn(actual.withRetry)
    };
});

vi.mock('./rate-limit.js', () => ({
    delay: vi.fn(async () => undefined)
}));

import { fetchSources } from './fetch-stage.js';
import { fetchHtml } from './client.js';
import { delay } from './rate-limit.js';
import { withRetry } from './retry.js';

describe('fetchSources', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('returns fetched snapshots and preserves source metadata', async () => {
        vi.mocked(fetchHtml)
            .mockResolvedValueOnce({
                url: 'https://norse-mythology.org/runes/the-meanings-of-the-runes/',
                statusCode: 200,
                fetchedAt: '2026-04-11T10:00:00.000Z',
                contentHash: 'hash-runes',
                html: '<html>runes</html>'
            })
            .mockResolvedValueOnce({
                url: 'https://andreashelley.com/blog/futhark-runes-symbols-and-meanings/',
                statusCode: 200,
                fetchedAt: '2026-04-11T10:00:01.000Z',
                contentHash: 'hash-andrea',
                html: '<html>andrea</html>'
            });

        const results = await fetchSources(
            [
                {
                    id: 'norse-runes',
                    url: 'https://norse-mythology.org/runes/the-meanings-of-the-runes/',
                    classification: 'reference_like'
                },
                {
                    id: 'andrea-runes',
                    url: 'https://andreashelley.com/blog/futhark-runes-symbols-and-meanings/',
                    classification: 'modern_interpretation'
                }
            ],
            {
                userAgent: 'ua',
                delayMs: 25,
                retries: 1
            }
        );

        expect(results).toEqual([
            {
                sourceId: 'norse-runes',
                classification: 'reference_like',
                url: 'https://norse-mythology.org/runes/the-meanings-of-the-runes/',
                statusCode: 200,
                fetchedAt: '2026-04-11T10:00:00.000Z',
                contentHash: 'hash-runes',
                html: '<html>runes</html>'
            },
            {
                sourceId: 'andrea-runes',
                classification: 'modern_interpretation',
                url: 'https://andreashelley.com/blog/futhark-runes-symbols-and-meanings/',
                statusCode: 200,
                fetchedAt: '2026-04-11T10:00:01.000Z',
                contentHash: 'hash-andrea',
                html: '<html>andrea</html>'
            }
        ]);

        expect(withRetry).toHaveBeenCalledTimes(2);
        expect(delay).toHaveBeenCalledTimes(1);
        expect(delay).toHaveBeenCalledWith(25);
    });

    it('fails loudly on HTTP status >= 400', async () => {
        vi.mocked(fetchHtml).mockResolvedValueOnce({
            url: 'https://norse-mythology.org/runes/the-meanings-of-the-runes/',
            statusCode: 500,
            fetchedAt: '2026-04-11T10:00:00.000Z',
            contentHash: 'hash-error',
            html: '<html>error</html>'
        });

        await expect(
            fetchSources(
                [
                    {
                        id: 'norse-runes',
                        url: 'https://norse-mythology.org/runes/the-meanings-of-the-runes/',
                        classification: 'reference_like'
                    }
                ],
                { userAgent: 'ua' }
            )
        ).rejects.toThrow(/failed to fetch norse-runes/i);
    });

    it('returns empty list when no sources provided', async () => {
        const results = await fetchSources([], { userAgent: 'ua' });
        expect(results).toEqual([]);
        expect(withRetry).not.toHaveBeenCalled();
    });
});
