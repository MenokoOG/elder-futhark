import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

function parseCorsOrigins(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /**
   * CORS:
   * - Local dev: Vite default is http://localhost:5173
   * - Prod: set CORS_ORIGINS to your deployed web origin(s), comma-separated
   */
  const envOrigins = parseCorsOrigins(process.env.CORS_ORIGINS);
  const defaultOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];

  const origins = envOrigins.length ? envOrigins : defaultOrigins;

  app.enableCors({
    origin: origins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  });

  // Frontend calls /api/...
  app.setGlobalPrefix("api");

  // Render sets PORT automatically. API_PORT is optional local override.
  const port = Number(process.env.PORT || process.env.API_PORT || 4000);
  await app.listen(port);

  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${port}/api`);
}
bootstrap();