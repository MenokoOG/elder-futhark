import { resolve } from 'node:path';
import { writeJson } from './dataset-writer.js';
import { writeTextFile } from './file-store.js';

export interface SnapshotMetadata {
    sourceId: string;
    classification: string;
    url: string;
    fetchedAt: string;
    contentHash: string;
    statusCode: number;
}

export interface RawSnapshot {
    sourceId: string;
    classification: string;
    url: string;
    fetchedAt: string;
    contentHash: string;
    statusCode: number;
    html: string;
}

export interface SnapshotWriteResult {
    htmlPath: string;
    metadataPath: string;
}

function assertSafeSourceId(sourceId: string): void {
    if (!/^[a-z0-9-]+$/.test(sourceId)) {
        throw new Error(`Invalid source id for snapshot path: ${sourceId}`);
    }
}

export async function writeRawSnapshot(outputDir: string, snapshot: RawSnapshot): Promise<SnapshotWriteResult> {
    assertSafeSourceId(snapshot.sourceId);

    const rawDir = resolve(outputDir, 'raw');
    const htmlPath = resolve(rawDir, `${snapshot.sourceId}.html`);
    const metadataPath = resolve(rawDir, `${snapshot.sourceId}.metadata.json`);

    await writeTextFile(htmlPath, snapshot.html);
    await writeJson(metadataPath, {
        sourceId: snapshot.sourceId,
        classification: snapshot.classification,
        url: snapshot.url,
        fetchedAt: snapshot.fetchedAt,
        contentHash: snapshot.contentHash,
        statusCode: snapshot.statusCode
    } satisfies SnapshotMetadata);

    return {
        htmlPath,
        metadataPath
    };
}
