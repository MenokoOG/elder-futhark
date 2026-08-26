import { z } from 'zod';
import { SourceReferenceSchema } from './source-record.schema.js';
export const WorldSchema = z.object({ id: z.string(), name: z.string(), summary: z.string().default(''), associations: z.array(z.string()).default([]), sources: z.array(SourceReferenceSchema).min(1), confidence: z.number().min(0).max(1) });
export type World = z.infer<typeof WorldSchema>;
