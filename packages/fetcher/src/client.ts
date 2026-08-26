import { request } from 'undici';
import { createHash } from 'node:crypto';
import { assertAllowlistedUrl } from './robots-policy.js';

export interface FetchHtmlResult {
    url: string;
    statusCode: number;
    fetchedAt: string;
    contentHash: string;
    html: string;
}

export async function fetchHtml(url: string, userAgent: string): Promise<FetchHtmlResult> {
    assertAllowlistedUrl(url);

    const { statusCode, body } = await request(url, {
        method: 'GET',
        headers: { 'user-agent': userAgent }
    });

    const html = await body.text();
    const contentHash = createHash('sha256').update(html).digest('hex');

    return {
        url,
        statusCode,
        fetchedAt: new Date().toISOString(),
        contentHash,
        html
    };
}
