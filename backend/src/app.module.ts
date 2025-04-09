import { join } from 'path';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core'; 
import { MongooseModule } from '@nestjs/mongoose';

import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

import { UsersModule } from './users/users.module';

import { UsersResolver } from './users/user.resolver';
import { EventsGateway } from './socket/events.gateway';
import { CatsModule } from './cats/cats.module';


@Module({
  imports: [
    AuthModule, 
    UsersModule, 
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: false
    }), 
    MongooseModule.forRoot('mongodb://localhost:27017/test'),
    CatsModule,
  ],
  controllers: [AppController],
  providers: [AppService,
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
    UsersResolver,
    EventsGateway
  ],
})
export class AppModule {}
