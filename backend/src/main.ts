import { NestFactory } from '@nestjs/core';

import { altairExpress } from 'altair-express-middleware';

import { AppModule } from './app.module';

import config from '../config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*', 
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  app.use('/altair', altairExpress({
    endpointURL: '/graphql',
  }));

  await app.listen(process.env.PORT ?? config.serverPort);
}
bootstrap();
