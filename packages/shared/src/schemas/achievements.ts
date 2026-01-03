import { z } from "zod";

export const AchievementKeySchema = z.enum([
  "FIRST_LOGIN",
  "FIRST_RITUAL",
  "STREAK_7",
  "STREAK_30",
  "FIRST_QUIZ",
  "QUIZ_10",
  "AETT1_MASTER",
  "AETT2_MASTER",
  "AETT3_MASTER",
  "SR_10_REVIEWS",
  "SR_50_REVIEWS",
  "DRAWING_NOVICE"
]);

export const AchievementSchema = z.object({
  key: AchievementKeySchema,
  unlockedAt: z.string()
});

export const AchievementsResponseSchema = z.object({
  streak: z.number().int(),
  totalStudyReviews: z.number().int(),
  bestQuizByAett: z.record(z.string(), z.number().int()),
  achievements: z.array(AchievementSchema)
});