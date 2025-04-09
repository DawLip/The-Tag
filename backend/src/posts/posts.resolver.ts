import { Args, Int, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";

import { Post } from "./models/post.model";
import { User } from "../users/models/user.model";
import { UsersService } from "../users/users.service";
import { PostsService } from "./posts.service";

@Resolver(() => Post)
export class PostsResolver {
  constructor(
    private usersService: UsersService,
    private postsService: PostsService,
  ) {}

  @Query(() => Post)
  async post(@Args('id', { type: () => Int }) id: number) {
    return this.postsService.findOneById(id);
  }

}
