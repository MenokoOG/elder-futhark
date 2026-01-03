import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { LoreController } from "./lore.controller";
import { LoreService } from "./lore.service";
import { Progress, ProgressSchema } from "../progress/progress.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Progress.name, schema: ProgressSchema }])
  ],
  controllers: [LoreController],
  providers: [LoreService],
  exports: [LoreService]
})
export class LoreModule {}