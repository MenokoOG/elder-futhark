import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type ProgressDocument = HydratedDocument<Progress>;

@Schema({ timestamps: true })
export class Progress {
  @Prop({ type: Types.ObjectId, index: true, required: true })
  userId!: Types.ObjectId;

  // Points / XP
  @Prop({ type: Number, default: 0 })
  points!: number;

  // Daily ritual streak
  @Prop({ type: Number, default: 0 })
  streak!: number;

  // Last ritual date (nullable)
  @Prop({ type: Date, default: null })
  lastRitualDate!: Date | null;

  // Last rune key used for ritual (nullable)
  @Prop({ type: String, default: null })
  lastRuneKey!: string | null;

  // --- Study / SRS metrics ---
  @Prop({ type: Number, default: 0 })
  totalStudyReviews!: number;

  // --- Quiz metrics ---
  // Store best quiz score per Aett as a simple map: { "1": 10, "2": 7, "3": 9 }
  // Use Map so Mongoose has a concrete runtime type.
  @Prop({ type: Map, of: Number, default: {} })
  bestQuizByAett!: Map<string, number>;

  // --- Unlocks ---
  @Prop({ type: [String], default: [] })
  unlockedLessonKeys!: string[];

  @Prop({ type: [String], default: [] })
  unlockedAchievementKeys!: string[];
}

export const ProgressSchema = SchemaFactory.createForClass(Progress);

// Helpful indexes
ProgressSchema.index({ userId: 1 }, { unique: true });
ProgressSchema.index({ points: -1 });
