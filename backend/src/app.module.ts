import { join } from 'path';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core'; 
import { MongooseModule } from '@nestjs/mongoose';

import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { EventsGateway } from './socket/events.gateway';

import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

import { UsersModule } from './users/users.module';
import { UsersResolver } from './users/user.resolver';

import { GameModule } from './game/game.module';
import { GameResolver, GameLogResolver } from './game/game.resolver';

import config from '../config';

@Module({
  imports: [
  AuthModule, 
    UsersModule, 
    GameModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: false,
      context: ({ req, res }) => ({ req, res })
    }), 
    MongooseModule.forRoot(config.mongo),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    EventsGateway,

    UsersResolver,
    GameResolver,
    GameLogResolver,
  ],
})
export class AppModule {}
