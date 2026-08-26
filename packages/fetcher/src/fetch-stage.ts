import { fetchHtml } from './client.js';
import { delay } from './rate-limit.js';
import { withRetry } from './retry.js';

export interface FetchSource {
    id: string;
    url: string;
    classification: string;
}

export interface FetchStageOptions {
    userAgent: string;
    retries?: number;
    delayMs?: number;
}

export interface FetchStageResult {
    sourceId: string;
    classification: string;
    url: string;
    statusCode: number;
    fetchedAt: string;
    contentHash: string;
    html: string;
}

export async function fetchSources(sources: FetchSource[], options: FetchStageOptions): Promise<FetchStageResult[]> {
    if (sources.length === 0) {
        return [];
    }

    const retries = options.retries ?? 2;
    const delayMs = options.delayMs ?? 0;
    const results: FetchStageResult[] = [];

    for (const [index, source] of sources.entries()) {
        const fetched = await withRetry(() => fetchHtml(source.url, options.userAgent), retries);

        if (fetched.statusCode >= 400) {
            throw new Error(`Failed to fetch ${source.id}: received status ${fetched.statusCode}`);
        }

        results.push({
            sourceId: source.id,
            classification: source.classification,
            url: fetched.url,
            statusCode: fetched.statusCode,
            fetchedAt: fetched.fetchedAt,
            contentHash: fetched.contentHash,
            html: fetched.html
        });

        if (delayMs > 0 && index < sources.length - 1) {
            await delay(delayMs);
        }
    }

    return results;
}
