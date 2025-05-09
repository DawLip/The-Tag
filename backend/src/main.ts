import { NestFactory } from '@nestjs/core';

import { altairExpress } from 'altair-express-middleware';

import { AppModule } from './app.module';

import config from '../config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',  // Adres IP urządzenia mobilnego (Expo Go)
    methods: 'GET,POST',
    allowedHeaders: 'Content-Type',
  });

  app.use('/altair', altairExpress({
    endpointURL: '/graphql',
  }));

  await app.listen(process.env.PORT ?? config.serverPort);
}
bootstrap();
