import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Your web app runs on 5173
  app.enableCors({
    origin: ["http://localhost:5173"],
    credentials: true
  });

  // ✅ Frontend calls /api/...
  app.setGlobalPrefix("api");

  const port = Number(process.env.PORT || 4000);
  await app.listen(port);

  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${port}/api`);
}
bootstrap();