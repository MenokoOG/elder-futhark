import { writeTextFile } from './file-store.js';
export async function writeJson(path: string, value: unknown): Promise<void> { await writeTextFile(path, JSON.stringify(value, null, 2)); }
