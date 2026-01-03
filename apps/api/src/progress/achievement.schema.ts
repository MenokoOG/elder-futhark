import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type AchievementDocument = HydratedDocument<Achievement>;

@Schema({ timestamps: true })
export class Achievement {
  @Prop({ index: true, required: true })
  userId!: string;

  @Prop({ required: true })
  key!: string;

  @Prop({ required: true })
  unlockedAt!: string; // ISO
}

export const AchievementSchema = SchemaFactory.createForClass(Achievement);
AchievementSchema.index({ userId: 1, key: 1 }, { unique: true });