import { Module } from "@nestjs/common";
import { LoreController } from "./lore.controller";
import { LoreService } from "./lore.service";
import { ProgressModule } from "../progress/progress.module";

@Module({
  imports: [ProgressModule],
  controllers: [LoreController],
  providers: [LoreService]
})
export class LoreModule {}