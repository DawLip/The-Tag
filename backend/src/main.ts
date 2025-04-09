import { NestFactory } from '@nestjs/core';

import { altairExpress } from 'altair-express-middleware';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use('/altair', altairExpress({
    endpointURL: '/graphql',
  }));

  await app.listen(process.env.PORT ?? 3010);
}
bootstrap();
