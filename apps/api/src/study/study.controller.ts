import { Controller, Get, Post, UseGuards, Body } from "@nestjs/common";
import { JwtGuard } from "../common/auth/jwt.guard";
import { GetUser } from "../common/auth/get-user.decorator";
import { StudyService } from "./study.service";
import { ZodValidationPipe } from "../common/pipes/zod-validation.pipe";
import { StudyGradeSchema } from "@efa/shared";

@UseGuards(JwtGuard)
@Controller("study")
export class StudyController {
  constructor(private study: StudyService) {}

  @Get("next")
  async next(@GetUser() user: any) {
    return this.study.next(user.userId);
  }

  @Post("grade")
  grade(@GetUser() user: any, @Body(new ZodValidationPipe(StudyGradeSchema)) body: any) {
    return this.study.grade(user.userId, body.runeKey, body.grade);
  }
}