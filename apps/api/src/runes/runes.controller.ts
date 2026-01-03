import { Controller, Get, Param, Query } from "@nestjs/common";
import { ZodValidationPipe } from "../common/pipes/zod-validation.pipe";
import { RuneListQuerySchema } from "@efa/shared";
import { RunesService } from "./runes.service";

@Controller("runes")
export class RunesController {
  constructor(private runes: RunesService) {}

  @Get()
  list(@Query(new ZodValidationPipe(RuneListQuerySchema)) query: any) {
    return this.runes.list(query.q, query.aett);
  }

  @Get("random")
  random() {
    return this.runes.random();
  }

  @Get(":key")
  byKey(@Param("key") key: string) {
    return this.runes.byKey(key);
  }
}