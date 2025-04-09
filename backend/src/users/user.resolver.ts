import { Args, Int, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";

import { User } from "./models/user.model";
import { UsersService } from "./users.service";
import { PostsService } from "../posts/posts.service";

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private usersService: UsersService,
    private postsService: PostsService,
  ) {}

  @Query(() => User)
  async author(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.findOneById(id);
  }

  @ResolveField()
  async posts(@Parent() author: User) {
    const { id } = author;
    return this.postsService.findAll(id);
  }
}
