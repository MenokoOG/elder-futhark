import { Controller, Get, Query } from "@nestjs/common";
import { RunesService } from "./runes.service";

@Controller("runes")
export class RunesController {
  constructor(private readonly runes: RunesService) {}

  @Get()
  async list(
    @Query("q") q?: string,
    @Query("aett") aettRaw?: string
  ) {
    const aett = aettRaw ? Number(aettRaw) : undefined;
    return this.runes.list({ q: q || undefined, aett: aett && !Number.isNaN(aett) ? aett : undefined });
  }
}