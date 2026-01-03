export type StatsOverview = {
  userId: string;

  // high-level
  points: number;
  level: number;
  nextLevelAt: number;

  // streaks / rituals
  ritual: {
    currentStreak: number;
    longestStreak: number;
    totalRitualDays: number;
    lastRitualDay: string | null; // YYYY-MM-DD
    runeOfDayKey: string | null;
  };

  // study (spaced repetition)
  study: {
    totalCards: number;
    dueNow: number;
    learning: number;
    mature: number;
    avgEase: number | null;
  };

  // achievements
  achievements: {
    unlocked: number;
    totalKnown: number | null; // null if you don't track "total"
    recent: Array<{ key: string; unlockedAt: string }>;
  };

  // quiz
  quiz: {
    attempts: number;
    bestScore: number | null;
    avgScore: number | null;
    lastAttemptAt: string | null;
  };

  // drawing practice
  drawing: {
    attempts: number;
    bestMatchScore: number | null;
    lastAttemptAt: string | null;
  };

  updatedAt: string; // ISO
};

export type LeaderboardRow = {
  userId: string;
  handle?: string | null;
  points: number;
  level: number;
  updatedAt: string;
};