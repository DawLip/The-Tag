import { Args, ID, Query, Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { Model, Types } from 'mongoose';

import { Game, GameLog } from "./models/game.model";
import { GameService } from "./game.service";
import { User } from "../users/models/user.model";
import { UsersService } from "src/users/users.service";

@Resolver(() => Game)
export class GameResolver {
  constructor(
    private gameService: GameService,
    private userService: UsersService
  ) {}

  
  @Query(() => Game)
  async game(@Args('_id', { type: () => ID }) _id: Types.ObjectId) {
    return this.gameService.findGame(_id); 
  }
  @Query(() => [Game])
  async games(@Args('userId', { type: () => ID }) userId: Types.ObjectId) {
    return this.gameService.findGames(userId); 
  }

  @ResolveField(() => User) 
  async owner(@Parent() game: Game) {
    return await this.userService.findOneById(game.owner.toString());
  }

  @ResolveField(() => User) 
  async gameMaster(@Parent() game: Game) {
    return await this.userService.findOneById(game.gameMaster.toString());
  }

  @ResolveField(() => [User]) 
  async players(@Parent() game: Game) {
    return await this.userService.findById(game.players.map((player) => player.playerId));
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