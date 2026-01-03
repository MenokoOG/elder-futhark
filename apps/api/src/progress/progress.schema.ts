import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type ProgressDocument = HydratedDocument<Progress>;

@Schema({ timestamps: true })
export class Progress {
  @Prop({ unique: true, index: true, required: true })
  userId!: string;

  @Prop({ default: 0 })
  streak!: number;

  @Prop({ default: null })
  lastRitualDate!: string | null; // YYYY-MM-DD

  @Prop({ default: 0 })
  totalStudyReviews!: number;

  @Prop({ type: Object, default: {} })
  bestQuizByAett!: Record<string, number>; // "1"|"2"|"3" => best score
}

export const ProgressSchema = SchemaFactory.createForClass(Progress);