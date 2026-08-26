import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { buildPreviewHtml, createPreviewServer, type PreviewSummary } from './preview-server.js';

const tempDirs: string[] = [];

afterEach(async () => {
    await Promise.all(tempDirs.map(async (dir) => rm(dir, { recursive: true, force: true })));
    tempDirs.length = 0;
});

async function writeJson(path: string, value: unknown): Promise<void> {
    await writeFile(path, JSON.stringify(value, null, 2), 'utf8');
}

async function setupPreviewData(dataDir: string): Promise<void> {
    await mkdir(join(dataDir, 'raw'), { recursive: true });
    await mkdir(join(dataDir, 'extracted'), { recursive: true });
    await mkdir(join(dataDir, 'normalized'), { recursive: true });

    await writeFile(join(dataDir, 'raw', '.keep'), '', 'utf8');
    await writeFile(join(dataDir, 'extracted', '.keep'), '', 'utf8');

    await writeFile(join(dataDir, 'raw', 'norse-runes.raw.txt'), '<html>ok</html>', 'utf8');
    await writeJson(join(dataDir, 'raw', 'norse-runes.metadata.json'), {
        sourceId: 'norse-runes',
        url: 'https://norse-mythology.org/runes/the-meanings-of-the-runes/',
        fetchedAt: '2026-04-11T00:00:00.000Z',
        contentHash: 'abc',
        statusCode: 200
    });
    await writeJson(join(dataDir, 'extracted', 'norse-runes.records.json'), [{ id: 'row-1' }]);

    await writeJson(join(dataDir, 'normalized', 'runes.json'), [
        {
            id: 'fehu',
            name: 'Fehu',
            summary: 'Wealth and movement.',
            sources: [
                {
                    sourceUrl: 'https://norse-mythology.org/runes/the-meanings-of-the-runes/',
                    classification: 'reference_like'
                }
            ]
        }
    ]);
    await writeJson(join(dataDir, 'normalized', 'deities.json'), []);
    await writeJson(join(dataDir, 'normalized', 'worlds.json'), []);
    await writeJson(join(dataDir, 'normalized', 'practices.records.json'), []);
    await writeJson(join(dataDir, 'normalized', 'adjacent-systems.records.json'), []);
}

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

    it('serves category drilldown APIs end-to-end', async () => {
        const dataDir = await mkdtemp(join(tmpdir(), 'efa-preview-test-'));
        tempDirs.push(dataDir);
        await setupPreviewData(dataDir);

        const server = createPreviewServer(dataDir);
        await new Promise<void>((resolvePromise, reject) => {
            server.once('error', reject);
            server.listen(0, '127.0.0.1', () => resolvePromise());
        });

        const address = server.address();
        if (!address || typeof address === 'string') {
            server.close();
            throw new Error('Failed to determine preview server address');
        }

        const baseUrl = `http://127.0.0.1:${address.port}`;

        const catalogResponse = await fetch(`${baseUrl}/api/catalog`);
        expect(catalogResponse.status).toBe(200);
        const catalog = (await catalogResponse.json()) as {
            categories: Array<{ id: string; count: number }>;
        };
        expect(catalog.categories.some((category) => category.id === 'runes' && category.count === 1)).toBe(true);

        const itemsResponse = await fetch(`${baseUrl}/api/category/runes`);
        expect(itemsResponse.status).toBe(200);
        const items = (await itemsResponse.json()) as Array<{ id: string; label: string }>;
        expect(items).toHaveLength(1);
        expect(items[0]).toMatchObject({ id: 'fehu', label: 'Fehu' });

        const detailResponse = await fetch(`${baseUrl}/api/category/runes/fehu`);
        expect(detailResponse.status).toBe(200);
        const detail = (await detailResponse.json()) as { id: string; name: string };
        expect(detail).toMatchObject({ id: 'fehu', name: 'Fehu' });

        const missingResponse = await fetch(`${baseUrl}/api/category/runes/unknown`);
        expect(missingResponse.status).toBe(404);

        await new Promise<void>((resolvePromise) => {
            server.close(() => resolvePromise());
        });
    });

    it('exposes pipeline run/status endpoints with single-run lock', async () => {
        const dataDir = await mkdtemp(join(tmpdir(), 'efa-preview-test-'));
        tempDirs.push(dataDir);
        await setupPreviewData(dataDir);

        let releaseRun: ((value: Array<{ stage: 'fetch'; summary: string }>) => void) | undefined;
        const runPipeline = vi.fn(
            async () =>
                await new Promise<Array<{ stage: 'fetch'; summary: string }>>((resolvePromise) => {
                    releaseRun = resolvePromise;
                })
        );

        const server = createPreviewServer(dataDir, { runPipeline });
        await new Promise<void>((resolvePromise, reject) => {
            server.once('error', reject);
            server.listen(0, '127.0.0.1', () => resolvePromise());
        });

        const address = server.address();
        if (!address || typeof address === 'string') {
            server.close();
            throw new Error('Failed to determine preview server address');
        }

        const baseUrl = `http://127.0.0.1:${address.port}`;

        const initialStatusResponse = await fetch(`${baseUrl}/api/pipeline/status`);
        expect(initialStatusResponse.status).toBe(200);
        const initialStatus = (await initialStatusResponse.json()) as {
            status: string;
            results?: Array<{ stage: string; summary: string }>;
        };
        expect(initialStatus.status).toBe('idle');

        const startResponse = await fetch(`${baseUrl}/api/pipeline/run?source=all`, { method: 'POST' });
        expect(startResponse.status).toBe(202);

        const lockedResponse = await fetch(`${baseUrl}/api/pipeline/run?source=all`, { method: 'POST' });
        expect(lockedResponse.status).toBe(409);

        const runningStatusResponse = await fetch(`${baseUrl}/api/pipeline/status`);
        const runningStatus = (await runningStatusResponse.json()) as {
            status: string;
            results?: Array<{ stage: string; summary: string }>;
        };
        expect(runningStatus.status).toBe('running');

        releaseRun?.([{ stage: 'fetch', summary: 'sources=1' }]);

        let finalStatus = runningStatus;
        for (let attempt = 0; attempt < 8; attempt += 1) {
            const response = await fetch(`${baseUrl}/api/pipeline/status`);
            finalStatus = (await response.json()) as { status: string; results?: Array<{ stage: string; summary: string }> };
            if (finalStatus.status === 'succeeded') {
                break;
            }
            await new Promise((resolvePromise) => setTimeout(resolvePromise, 10));
        }

        expect(finalStatus.status).toBe('succeeded');
        expect(finalStatus.results?.[0]).toMatchObject({ stage: 'fetch', summary: 'sources=1' });
        expect(runPipeline).toHaveBeenCalledTimes(1);

        await new Promise<void>((resolvePromise) => {
            server.close(() => resolvePromise());
        });
    });
});
