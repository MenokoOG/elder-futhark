import { Body, Controller, Get, UseGuards } from "@nestjs/common";
import { Post } from "@nestjs/common";
import { ZodValidationPipe } from "../common/pipes/zod-validation.pipe";
import { LoginSchema, SignupSchema } from "@efa/shared";
import { AuthService } from "./auth.service";
import { JwtGuard } from "../common/auth/jwt.guard";
import { GetUser } from "../common/auth/get-user.decorator";

@Controller("auth")
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post("signup")
  signup(@Body(new ZodValidationPipe(SignupSchema)) body: any) {
    return this.auth.signup(body);
  }

  @Post("login")
  login(@Body(new ZodValidationPipe(LoginSchema)) body: any) {
    return this.auth.login(body);
  }

  @UseGuards(JwtGuard)
  @Get("me")
  me(@GetUser() user: any) {
    return { user };
  }
}