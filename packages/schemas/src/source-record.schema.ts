import { z } from 'zod';
export const SourceReferenceSchema = z.object({ sourceSite: z.string(), sourceUrl: z.string().url(), sourceTitle: z.string().optional(), extractedAt: z.string(), extractorVersion: z.string(), contentHash: z.string(), classification: z.enum(['reference_like','practical_guide','modern_interpretation','adjacent_symbolic_system']) });
export const ExtractedSectionSchema = z.object({ heading: z.string().optional(), text: z.string() });
export const SourceRecordSchema = z.object({ id: z.string(), kind: z.enum(['rune_source','deity_source','world_source','practice_source','adjacent_source','generic_page']), title: z.string(), summary: z.string().optional(), sections: z.array(ExtractedSectionSchema).default([]), references: z.array(SourceReferenceSchema).min(1), tags: z.array(z.string()).default([]) });
export type SourceRecord = z.infer<typeof SourceRecordSchema>;
