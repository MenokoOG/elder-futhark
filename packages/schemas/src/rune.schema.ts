import { z } from 'zod';
import { SourceReferenceSchema } from './source-record.schema.js';
export const RuneSchema = z.object({ id: z.string(), glyph: z.string().min(1), name: z.string(), phonetic: z.array(z.string()).default([]), aett: z.number().int().min(1).max(3).optional(), coreMeanings: z.array(z.string()).default([]), historicalNotes: z.array(z.string()).default([]), interpretiveNotes: z.array(z.string()).default([]), keywords: z.array(z.string()).default([]), sources: z.array(SourceReferenceSchema).min(1), confidence: z.number().min(0).max(1) });
export type Rune = z.infer<typeof RuneSchema>;
