import { z } from 'zod';
import { RuneSchema } from './rune.schema.js';
import { DeitySchema } from './deity.schema.js';
import { WorldSchema } from './world.schema.js';
export const DatasetManifestSchema = z.object({ version: z.string(), builtAt: z.string().nullable(), sourceCount: z.number().int().nonnegative(), recordCount: z.number().int().nonnegative() });
export const DatasetSchema = z.object({ manifest: DatasetManifestSchema, runes: z.array(RuneSchema).default([]), deities: z.array(DeitySchema).default([]), worlds: z.array(WorldSchema).default([]) });
export type DatasetManifest = z.infer<typeof DatasetManifestSchema>;
export type Dataset = z.infer<typeof DatasetSchema>;
