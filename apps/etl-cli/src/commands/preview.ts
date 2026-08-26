import { dirname, resolve } from 'node:path';
import { loadConfig, resolveSourceRegistryPath } from '@efa/config';
import { startPreviewServer } from '../ui/preview-server.js';

export interface PreviewCommandOptions {
    port: string;
}

export async function previewCommand(options: PreviewCommandOptions): Promise<{ url: string }> {
    const port = Number(options.port);
    if (!Number.isInteger(port) || port <= 0 || port > 65535) {
        throw new Error(`Invalid port: ${options.port}`);
    }

    const config = loadConfig();
    const registryPath = await resolveSourceRegistryPath();
    const baseDir = dirname(registryPath);
    const dataDir = resolve(baseDir, config.EFA_OUTPUT_DIR);

    await startPreviewServer(dataDir, port);

    return {
        url: `http://127.0.0.1:${port}`
    };
}
