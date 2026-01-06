import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { RunesController } from "./runes.controller";
import { RunesService } from "./runes.service";
import { RuneSchema } from "./rune.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Rune", schema: RuneSchema }])
  ],
  controllers: [RunesController],
  providers: [RunesService],
  exports: [RunesService]
})
export class RunesModule {}