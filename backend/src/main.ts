import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>("port", 4000);

  app.enableCors({
    origin: "http://localhost:3000",
  });

  await app.listen(port, "127.0.0.1");
}

void bootstrap();
