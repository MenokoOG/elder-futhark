import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import path from "node:path";

import { EnvSchema } from "./config/env.validation";

import { AuthModule } from "./auth/auth.module";
import { RunesModule } from "./runes/runes.module";
import { ToolsModule } from "./tools/tools.module";
import { ProgressModule } from "./progress/progress.module";
import { RitualModule } from "./ritual/ritual.module";
import { StudyModule } from "./study/study.module";
import { LoreModule } from "./lore/lore.module";
import { StatsModule } from "./stats/stats.module";
import { HealthModule } from "./health/health.module";

function mustGetEnv(name: string): string {
  const v = process.env[name];
  if (!v || !String(v).trim()) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return String(v);
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(process.cwd(), ".env"),
      validate: (raw: Record<string, unknown>) => {
        const parsed = EnvSchema.safeParse(raw);
        if (!parsed.success) {
          console.error(parsed.error.flatten());
          throw new Error("Invalid environment variables");
        }
        return parsed.data;
      }
    }),

    MongooseModule.forRoot(mustGetEnv("MONGODB_URI"), {
      serverSelectionTimeoutMS: 10_000,
      connectTimeoutMS: 10_000
    }),

    HealthModule,
    AuthModule,
    RunesModule,
    ToolsModule,
    ProgressModule,
    RitualModule,
    StudyModule,
    LoreModule,
    StatsModule,
    
  ]
})
export class AppModule {}
