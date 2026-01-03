import { z } from "zod";

export const RuneKeySchema = z.string().min(1);

export const RuneSchema = z.object({
  key: z.string().min(1),
  glyph: z.string().min(1),
  name: z.string().min(1),
  phonetic: z.string().min(1),
  meaning: z.array(z.string().min(1)).min(1),
  aett: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  notes: z.string().min(1)
});

export type RuneDTO = z.infer<typeof RuneSchema>;

export const RuneListQuerySchema = z.object({
  q: z.string().optional(),
  aett: z.coerce.number().int().min(1).max(3).optional()
});
export type RuneListQuery = z.infer<typeof RuneListQuerySchema>;