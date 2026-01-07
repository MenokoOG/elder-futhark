import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

function parseOrigins(): string[] {
  const raw = process.env.CORS_ORIGINS || "";
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function isLocalhost(origin: string) {
  return (
    origin.startsWith("http://localhost:") ||
    origin.startsWith("http://127.0.0.1:") ||
    origin.startsWith("http://0.0.0.0:")
  );
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowed = parseOrigins();
  const allowListMode = allowed.length > 0;

  app.enableCors({
    credentials: true,
    origin: (origin, cb) => {
      // Allow server-to-server / curl / health checks (no Origin header)
      if (!origin) return cb(null, true);

      // Always allow local dev
      if (isLocalhost(origin)) return cb(null, true);

      // If allowlist is configured, enforce it for deployed origins
      if (allowListMode) {
        return allowed.includes(origin)
          ? cb(null, true)
          : cb(new Error(`CORS blocked for origin: ${origin}`), false);
      }

      // If no allowlist set, allow everything (safe-ish for MVP, but not ideal long term)
      return cb(null, true);
    },
  });

  app.setGlobalPrefix("api");

  const port = Number(process.env.PORT || process.env.API_PORT || 4000);
  await app.listen(port);

  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${port}/api`);
}

bootstrap();
