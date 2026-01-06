import { Controller, Get, Query } from "@nestjs/common";
import { ELDER_FUTHARK } from "@efa/shared";

@Controller("study")
export class StudyController {
  // Minimal endpoint to keep Flashcards/Decks alive
  @Get("next")
  next(@Query("aett") aettRaw?: string) {
    const aett = aettRaw ? Number(aettRaw) : undefined;
    const pool = aett && !Number.isNaN(aett) ? ELDER_FUTHARK.filter(r => r.aett === aett) : ELDER_FUTHARK;

    const pick = pool[Math.floor(Math.random() * pool.length)];
    return {
      card: pick,
      due: true
    };
  }
}