import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Rune, RuneSchema } from "./rune.schema";
import { RunesController } from "./runes.controller";
import { RunesService } from "./runes.service";

@Module({
  imports: [MongooseModule.forFeature([{ name: Rune.name, schema: RuneSchema }])],
  controllers: [RunesController],
  providers: [RunesService],
  exports: [RunesService]
})
export class RunesModule {}