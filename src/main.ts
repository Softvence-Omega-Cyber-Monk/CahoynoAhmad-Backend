import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{rawBody:true});

  // Middleware should be registered before setting global prefix
  app.use('/api/stripe/webhook', bodyParser.raw({ type: 'application/json' }));

  // Set global prefix after middleware
  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
