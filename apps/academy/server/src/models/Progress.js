import mongoose from "mongoose";

const ProgressSchema = new mongoose.Schema(
  {
    userId: { type: String, index: true, required: true },
    ritualDate: { type: String, default: null },
    lastRuneKey: { type: String, default: null },
    ritualStreak: { type: Number, default: 0 },

    totalStudyReviews: { type: Number, default: 0 },
    bestQuizByAett: { type: Map, of: Number, default: {} },
    unlockedLessonKeys: { type: [String], default: [] },
    unlockedAchievementKeys: { type: [String], default: [] }
  },
  { versionKey: false }
);

export const Progress = mongoose.model("Progress", ProgressSchema);
