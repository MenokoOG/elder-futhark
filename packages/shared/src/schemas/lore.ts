import { z } from "zod";

export const LoreAettSchema = z.union([z.literal(1), z.literal(2), z.literal(3)]);

export const LoreLessonSchema = z.object({
  id: z.string(),
  aett: LoreAettSchema,
  title: z.string(),
  summary: z.string(),
  bullets: z.array(z.string())
});

export const LoreListResponseSchema = z.object({
  unlockedAetts: z.array(LoreAettSchema),
  lessons: z.array(LoreLessonSchema)
});