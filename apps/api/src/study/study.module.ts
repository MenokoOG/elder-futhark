import { Module } from "@nestjs/common";
import { StudyController } from "./study.controller";
import { StudyService } from "./study.service";
import { ProgressModule } from "../progress/progress.module";
import { MongooseModule } from "@nestjs/mongoose";
import { StudyItem, StudyItemSchema } from "../progress/study-item.schema";
import { Progress, ProgressSchema } from "../progress/progress.schema";

@Module({
  imports: [
    ProgressModule,
    MongooseModule.forFeature([
      { name: StudyItem.name, schema: StudyItemSchema },
      { name: Progress.name, schema: ProgressSchema }
    ])
  ],
  controllers: [StudyController],
  providers: [StudyService]
})
export class StudyModule {}