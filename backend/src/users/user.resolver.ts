import { Args, Int, Parent, Query, ResolveField, Resolver, Mutation } from "@nestjs/graphql";

import { User } from "./models/user.model";

import { UsersService } from "./users.service";
import { AuthService } from '../auth/auth.service';

import { RegisterInput, LoginInput, ModifyFriendListInput } from "./DTO/user.input";
import { UserWithToken, Status } from "./DTO/user.dto";

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

  @Mutation(() => UserWithToken)
  async login(@Args('loginInput') loginInput: LoginInput) {
    return await this.authService.login(loginInput);
  }

  @Mutation(() => User)
  async register(@Args('registerInput') registerInput: RegisterInput) {
    const createdUser = await this.usersService.create(registerInput);
    return createdUser;
  }

  @Mutation(() => Status)
  async inviteFriend(@Args('addFriend') addFriendInput: ModifyFriendListInput) {
    return await this.usersService.addFriend(addFriendInput);
  }

  @Mutation(() => Status)
  async reactToFriendInvitation(@Args('addFriend') addFriendInput: ModifyFriendListInput) {
    return await this.usersService.addFriend(addFriendInput);
  }

  @Mutation(() => Status)
  async removeFriend(@Args('removeFriend') removeFriendInput: ModifyFriendListInput) {
    return await this.usersService.removeFriend(removeFriendInput);
  }

  @ResolveField()
  async friends(@Parent() user: any) {
    return this.usersService.findAllFriends(user);
  }
}
