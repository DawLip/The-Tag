import { Args, ID, Query, Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { Model, Types } from 'mongoose';

import { Game, GameLog } from "./models/game.model";
import { GameService } from "./game.service";
import { User } from "../users/models/user.model";

@Resolver(() => Game)
export class GameResolver {
  constructor(
    private gameService: GameService
  ) {}

  
  @Query(() => Game)
  async game(@Args('_id', { type: () => ID }) _id: Types.ObjectId) {
    return this.gameService.findGame(_id); 
  }

  @ResolveField(() => User) 
  async owner(@Parent() game: Game) {
    return {};
  }

  @ResolveField(() => User) 
  async gameMaster(@Parent() game: Game) {
    return {};
  }

  @ResolveField(() => [User]) 
  async spectators(@Parent() game: Game) {
    return [];
  }

  @ResolveField(() => [User]) 
  async players(@Parent() game: Game) {
    return [];
  }
}

@Resolver(() => GameLog)
export class GameLogResolver {
  constructor(
    private gameService: GameService,
  ) {}

  @Query(() => Game)
  async gameLog(@Args('_id', { type: () => ID }) id: string) {
    return []; 
  }
}