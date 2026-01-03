import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type RuneDocument = HydratedDocument<Rune>;

@Schema({ timestamps: true })
export class Rune {
  @Prop({ unique: true, index: true, required: true })
  key!: string;

  @Prop({ required: true })
  glyph!: string;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  phonetic!: string;

  @Prop({ type: [String], required: true })
  meaning!: string[];

  @Prop({ required: true })
  aett!: number;

  @Prop({ required: true })
  notes!: string;
}

export const RuneSchema = SchemaFactory.createForClass(Rune);
