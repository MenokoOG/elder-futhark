import { z } from "zod";

export const Sm2GradeSchema = z.union([
  z.literal(0), z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)
]);

export const StudyNextResponseSchema = z.object({
  runeKey: z.string(),
  dueAt: z.string(),
  repetitions: z.number().int(),
  intervalDays: z.number().int(),
  easeFactor: z.number(),
  lapses: z.number().int()
});

export const StudyGradeSchema = z.object({
  runeKey: z.string().min(1),
  grade: Sm2GradeSchema
});