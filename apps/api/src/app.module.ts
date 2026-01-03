import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "./auth/auth.module";
import { EnvSchema } from "./config/env.validation";
import { LoreModule } from "./lore/lore.module";
import { ProgressModule } from "./progress/progress.module";
import { RitualModule } from "./ritual/ritual.module";
import { RunesModule } from "./runes/runes.module";
import { StudyModule } from "./study/study.module";
import { ToolsModule } from "./tools/tools.module";
import { StatsModule } from "./stats/stats-module.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (raw: Record<string, unknown>) => {
        const parsed = EnvSchema.safeParse(raw);
        if (!parsed.success) {
          console.error(parsed.error.flatten());
          throw new Error("Invalid environment variables");
        }
        return parsed.data;
      }
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI as string),
    AuthModule,
    RunesModule,
    ToolsModule,
    ProgressModule,
    RitualModule,
    StudyModule,
    LoreModule,
    StatsModule
  ]
})
export class AppModule { }