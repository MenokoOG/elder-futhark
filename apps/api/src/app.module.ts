import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { EnvSchema } from "./config/env.validation";
import { AuthModule } from "./auth/auth.module";
import { RunesModule } from "./runes/runes.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (raw: Record<string, unknown>) => {
        const parsed = EnvSchema.safeParse(raw);
        if (!parsed.success) {
          // eslint-disable-next-line no-console
          console.error(parsed.error.flatten());
          throw new Error("Invalid environment variables");
        }
        return parsed.data;
      }
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI as string),
    AuthModule,
    RunesModule
  ]
})
export class AppModule {}