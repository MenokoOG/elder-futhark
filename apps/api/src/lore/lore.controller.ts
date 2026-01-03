import { Controller, Get, UseGuards } from "@nestjs/common";
import { JwtGuard } from "../common/auth/jwt.guard";
import { GetUser } from "../common/auth/get-user.decorator";
import { LoreService } from "./lore.service";

@UseGuards(JwtGuard)
@Controller("lore")
export class LoreController {
  constructor(private lore: LoreService) {}

  @Get()
  list(@GetUser() user: any) {
    return this.lore.list(user.userId);
  }
}