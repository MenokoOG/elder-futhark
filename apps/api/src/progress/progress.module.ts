import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { Progress, ProgressSchema } from "./progress.schema";
import { StudyItem, StudyItemSchema } from "./study-item.schema";
import { Achievement, AchievementSchema } from "./achievement.schema";

import { ProgressService } from "./progress.service";
import { ProgressController } from "./progress.controller";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Progress.name, schema: ProgressSchema },
      { name: StudyItem.name, schema: StudyItemSchema },
      { name: Achievement.name, schema: AchievementSchema }
    ])
  ],
  controllers: [ProgressController],
  providers: [ProgressService],
  exports: [
    ProgressService,          // ✅ this is the key fix
    MongooseModule            // ✅ optional but useful if other modules need models
  ]
})
export class ProgressModule {}
