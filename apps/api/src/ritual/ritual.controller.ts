import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { JwtGuard } from "../common/auth/jwt.guard";
import { GetUser } from "../common/auth/get-user.decorator";
import { RitualService } from "./ritual.service";
import { ZodValidationPipe } from "../common/pipes/zod-validation.pipe";
import { ClaimRitualSchema } from "@efa/shared";

@UseGuards(JwtGuard)
@Controller("ritual")
export class RitualController {
  constructor(private ritual: RitualService) {}

  @Get("rune-of-day")
  get(@GetUser() user: any) {
    return this.ritual.getRuneOfDay(user.userId);
  }

  @Post("claim")
  claim(@GetUser() user: any, @Body(new ZodValidationPipe(ClaimRitualSchema)) body: any) {
    return this.ritual.claim(user.userId, body.isoDate);
  }
}