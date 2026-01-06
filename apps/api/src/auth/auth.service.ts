import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { UsersService } from "../users/users.service";

@Injectable()
export class AuthService {
  constructor(private users: UsersService, private jwt: JwtService) {}

  async signup(input: { email: string; password: string; handle?: string }) {
    const exists = await this.users.findByEmail(input.email);
    if (exists) throw new BadRequestException({ message: "Email already in use" });

    const passwordHash = await bcrypt.hash(input.password, 12);
    const handle = this.deriveHandle(input.handle, input.email);
    const user = await this.users.createUser({
      email: input.email,
      passwordHash,
      handle
    });

    return this.issueToken(String(user._id), user.email, user.handle);
  }

  async login(input: { email: string; password: string }) {
    const user = await this.users.findByEmail(input.email);
    if (!user) throw new UnauthorizedException({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(input.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException({ message: "Invalid credentials" });

    return this.issueToken(String(user._id), user.email, user.handle);
  }

  private issueToken(userId: string, email: string, handle: string) {
    const token = this.jwt.sign({ sub: userId, email, handle });
    return { token, user: { id: userId, email, handle } };
  }

  private deriveHandle(handle: string | undefined, email: string) {
    const baseFromEmail = email.split("@")[0] || "user";
    const raw = handle?.trim() || baseFromEmail;
    const sanitized = raw.replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 30);
    return sanitized || "user";
  }
}