import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { z } from 'zod';

const ALLOWED_SOURCE_HOSTS = new Set(['norse-mythology.org', 'andreashelley.com']);

const EnvSchema = z.object({
    LOG_LEVEL: z.string().default('info'),
    EFA_USER_AGENT: z.string().default('elder-futhark-etl/0.1 (+local-dev)'),
    EFA_FETCH_DELAY_MS: z.coerce.number().int().positive().default(1500),
    EFA_MAX_CONCURRENCY: z.coerce.number().int().positive().default(2),
    EFA_OUTPUT_DIR: z.string().default('./data')
});

const SourceClassificationSchema = z.enum([
    'reference_like',
    'practical_guide',
    'modern_interpretation',
    'adjacent_symbolic_system'
]);

const SourceConfigSchema = z.object({
    id: z
        .string()
        .min(1, 'source id is required')
        .regex(/^[a-z0-9-]+$/, 'source id must contain only lowercase letters, numbers, and hyphens'),
    url: z
        .string()
        .url('source url must be a valid URL')
        .refine((value) => {
            const parsed = new URL(value);
            return parsed.protocol === 'http:' || parsed.protocol === 'https:';
        }, 'source url must use http(s) protocol')
        .refine((value) => {
            const parsed = new URL(value);
            return ALLOWED_SOURCE_HOSTS.has(parsed.hostname);
        }, 'source url host is not allowlisted'),
    classification: SourceClassificationSchema
});

const SourceRegistrySchema = z
    .object({
        sources: z.array(SourceConfigSchema).min(1, 'registry must contain at least one source')
    })
    .superRefine((registry, context) => {
        const seen = new Set<string>();
        for (const source of registry.sources) {
            if (seen.has(source.id)) {
                context.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['sources'],
                    message: `duplicate source id detected: ${source.id}`
                });
            }
            seen.add(source.id);
        }
    });

export type AppConfig = z.infer<typeof EnvSchema>;
export type SourceClassification = z.infer<typeof SourceClassificationSchema>;
export type SourceConfig = z.infer<typeof SourceConfigSchema>;
export type SourceRegistry = z.infer<typeof SourceRegistrySchema>;

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
    return EnvSchema.parse(env);
}

export async function resolveSourceRegistryPath(registryPath = 'SOURCE_REGISTRY.json'): Promise<string> {
    if (registryPath.startsWith('/')) {
        return registryPath;
    }

    let currentDir = process.cwd();
    while (true) {
        const candidate = resolve(currentDir, registryPath);
        try {
            await readFile(candidate, 'utf8');
            return candidate;
        } catch {
            const parent = resolve(currentDir, '..');
            if (parent === currentDir) {
                break;
            }
            currentDir = parent;
        }
    }

    throw new Error(`Failed to locate source registry ${registryPath} by searching parent directories from ${process.cwd()}`);
}

export async function loadSourceRegistry(registryPath = 'SOURCE_REGISTRY.json'): Promise<SourceRegistry> {
    const absolutePath = await resolveSourceRegistryPath(registryPath);

    let raw: string;
    try {
        raw = await readFile(absolutePath, 'utf8');
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to read source registry at ${absolutePath}: ${message}`);
    }

    let parsed: unknown;
    try {
        parsed = JSON.parse(raw);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to parse source registry JSON at ${absolutePath}: ${message}`);
    }

    const result = SourceRegistrySchema.safeParse(parsed);
    if (!result.success) {
        throw new Error(`Invalid source registry at ${absolutePath}: ${result.error.message}`);
    }

    return result.data;
}
