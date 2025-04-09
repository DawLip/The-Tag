import { join } from 'path';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core'; 

import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';

import { UsersResolver } from './users/user.resolver';
import { PostsResolver } from './posts/posts.resolver';
import { EventsGateway } from './socket/events.gateway';


@Module({
  imports: [
    AuthModule, UsersModule, 
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: false
    }), PostsModule],
  controllers: [AppController],
  providers: [AppService,
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
    UsersResolver,
    PostsResolver,
    EventsGateway
  ],
})
export class AppModule {}
