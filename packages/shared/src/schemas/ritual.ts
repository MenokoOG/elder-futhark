import { z } from "zod";

export const RuneOfDayResponseSchema = z.object({
  isoDate: z.string(),
  runeKey: z.string(),
  streak: z.number().int(),
  claimedToday: z.boolean()
});

export const ClaimRitualSchema = z.object({
  isoDate: z.string()
});