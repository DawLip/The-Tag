import { Args, Int, Parent, Query, ResolveField, Resolver, Mutation, Context } from "@nestjs/graphql";

import { User } from "./models/user.model";

import { UsersService } from "./users.service";
import { AuthService } from '../auth/auth.service';

import { RegisterInput, LoginInput, ModifyFriendListInput } from "./dto/user.input";
import { UserWithToken, Status } from "./dto/user.dto";
import { Public } from "src/auth/auth.public";

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private usersService: UsersService,
    private authService: AuthService
  ) {}

  @Query(() => User)
  async user(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.findOneById(id);
  }

  @Public()
  @Mutation(() => UserWithToken)
  async login(@Args('loginInput') input: LoginInput) {
    return await this.authService.login(input);
  }

  @Public()
  @Mutation(() => User)
  async register(@Args('registerInput') input: RegisterInput) {
    const createdUser = await this.usersService.create(input);
    return createdUser;
  }

  @Mutation(() => Status)
  async inviteFriend(@Args('addFriend') input: ModifyFriendListInput) {
    return await this.usersService.addFriend(input);
  }

  @Mutation(() => Status)
  async reactToFriendInvitation(@Args('addFriend') input: ModifyFriendListInput) {
    return await this.usersService.addFriend(input);
  }

  @Mutation(() => Status)
  async removeFriend(@Args('removeFriend') input: ModifyFriendListInput) {
    return await this.usersService.removeFriend(input);
  }

  @ResolveField()
  async friends(@Parent() user: any) {
    return this.usersService.findAllFriends(user);
  }
}
