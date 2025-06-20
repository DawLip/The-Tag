import { Args, Int, Parent, Query, ResolveField, Resolver, Mutation, Context } from "@nestjs/graphql";

import { User } from "./models/user.model";

import { UsersService } from "./users.service";
import { AuthService } from '../auth/auth.service';

import { RegisterInput, LoginInput, ModifyFriendListInput, GetUserInput, ChangePassowordViaEmailInput, ChangePassowordInput, ChangeEmailInput } from "./dto/user.input";
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

  @Query(() => [User])
  async users() {
    return this.usersService.findAll();
  }

  @Public()
  @Mutation(() => UserWithToken)
  async login(@Args('input') input: LoginInput) {
    console.log("=== Login attempt ===");
    return await this.authService.login(input);
  }

  @Public()
  @Mutation(() => UserWithToken)
  async register(@Args('input') input: RegisterInput) {
    const createdUser = await this.usersService.register(input);
    return createdUser;
  }

  @Mutation(() => Status)
  async changePassword(@Args('input') input: ChangePassowordInput) {
    return await this.usersService.changePassword(input);
  }
  @Public()
  @Mutation(() => Status)
  async changePasswordViaEmail(@Args('input') input: ChangePassowordViaEmailInput) {
    return await this.usersService.changePasswordViaEmail(input);
  }
  @Mutation(() => Status)
  async changeEmail(@Args('input') input: ChangeEmailInput) {
    return await this.usersService.changeEmail(input);
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

  @Public()
  @Mutation(() => Status)
  async resetPassword(@Args('email') email: string) {
    return await this.usersService.resetPassword(email);
  }

  @ResolveField()
  async friends(@Parent() user: any) {
    return this.usersService.findAllFriends(user);
  }
}
