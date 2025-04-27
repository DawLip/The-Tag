import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Game, GameSchema, GameLog, GameLogSchema } from './models/game.model';

import { GameService } from './game.service';
import { GameResolver } from './game.resolver';

import { UsersModule } from '../users/users.module';  // Tylko zaimportuj UsersModule

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Game.name, schema: GameSchema },
      { name: GameLog.name, schema: GameLogSchema }
    ]),
    UsersModule,
  ],
  providers: [GameService], 
  exports: [GameService],
})
export class GameModule {}