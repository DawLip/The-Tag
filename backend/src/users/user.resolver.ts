import { Args, Int, Parent, Query, ResolveField, Resolver, Mutation, Context } from "@nestjs/graphql";

import { User } from "./models/user.model";

import { UsersService } from "./users.service";
import { AuthService } from '../auth/auth.service';

import { RegisterInput, LoginInput, ModifyFriendListInput, GetUserInput } from "./dto/user.input";
import { UserWithToken, Status } from "./dto/user.dto";
import { Public } from "src/auth/auth.public";

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private usersService: UsersService,
    private authService: AuthService
  ) {}

  @Query(() => User)
  async user(@Args('input') input: GetUserInput) {
    return this.usersService.findOne(input);
  }

  @Public()
  @Mutation(() => UserWithToken)
  async login(@Args('input') input: LoginInput) {
    return await this.authService.login(input);
  }

  @Public()
  @Mutation(() => User)
  async register(@Args('input') input: RegisterInput) {
    const createdUser = await this.usersService.create(input);
    return createdUser;
  }

  @Mutation(() => Status)
  async inviteFriend(@Args('input') input: ModifyFriendListInput) {
    return await this.usersService.addFriend(input);
  }

  @Mutation(() => Status)
  async reactToFriendInvitation(@Args('input') input: ModifyFriendListInput) {
    return await this.usersService.addFriend(input);
  }

  @Mutation(() => Status)
  async removeFriend(@Args('input') input: ModifyFriendListInput) {
    return await this.usersService.removeFriend(input);
  }

  @ResolveField()
  async friends(@Parent() user: any) {
    return this.usersService.findAllFriends(user);
  }
}
