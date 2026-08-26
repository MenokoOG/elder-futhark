import { z } from 'zod';
import { SourceReferenceSchema } from './source-record.schema.js';
export const DeitySchema = z.object({ id: z.string(), name: z.string(), type: z.string().optional(), aliases: z.array(z.string()).default([]), domains: z.array(z.string()).default([]), description: z.string().default(''), sources: z.array(SourceReferenceSchema).min(1), confidence: z.number().min(0).max(1) });
export type Deity = z.infer<typeof DeitySchema>;
