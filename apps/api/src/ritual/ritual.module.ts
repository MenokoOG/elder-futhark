import { Module } from "@nestjs/common";
import { RitualController } from "./ritual.controller";
import { RitualService } from "./ritual.service";
import { ProgressModule } from "../progress/progress.module";
import { MongooseModule } from "@nestjs/mongoose";
import { Progress, ProgressSchema } from "../progress/progress.schema";

@Module({
  imports: [
    ProgressModule,
    MongooseModule.forFeature([{ name: Progress.name, schema: ProgressSchema }])
  ],
  controllers: [RitualController],
  providers: [RitualService]
})
export class RitualModule {}