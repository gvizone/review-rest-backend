import 'reflect-metadata';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { json, urlencoded } from 'express';
import { env } from './config/env';
import { AppModule } from './app.module';

const jsonBodyLimit = '32mb';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(json({ limit: jsonBodyLimit }));
  app.use(urlencoded({ extended: true, limit: jsonBodyLimit }));
  app.enableCors({
    origin: env.cors.origins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(env.port);
}
void bootstrap();
