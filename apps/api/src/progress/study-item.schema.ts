import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type StudyItemDocument = HydratedDocument<StudyItem>;

@Schema({ timestamps: true })
export class StudyItem {
  @Prop({ index: true, required: true })
  userId!: string;

  @Prop({ index: true, required: true })
  runeKey!: string;

  @Prop({ default: 0 })
  repetitions!: number;

  @Prop({ default: 0 })
  intervalDays!: number;

  @Prop({ default: 2.5 })
  easeFactor!: number;

  @Prop({ required: true })
  dueAt!: string;

  @Prop({ default: 0 })
  lapses!: number;
}

export const StudyItemSchema = SchemaFactory.createForClass(StudyItem);
StudyItemSchema.index({ userId: 1, runeKey: 1 }, { unique: true });
StudyItemSchema.index({ userId: 1, dueAt: 1 });