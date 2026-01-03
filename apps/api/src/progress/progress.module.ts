import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Progress, ProgressSchema } from "./progress.schema";
import { Achievement, AchievementSchema } from "./achievement.schema";
import { StudyItem, StudyItemSchema } from "./study-item.schema";
import { ProgressService } from "./progress.service";
import { ProgressController } from "./progress.controller";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Progress.name, schema: ProgressSchema },
      { name: Achievement.name, schema: AchievementSchema },
      { name: StudyItem.name, schema: StudyItemSchema }
    ])
  ],
  providers: [ProgressService],
  controllers: [ProgressController],
  exports: [ProgressService]
})
export class ProgressModule {}