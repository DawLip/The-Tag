import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class LoginInput {
  @Field()
  email: string;

  @Field()
  password: string;
}

@InputType()
export class RegisterInput {
  @Field(type => Int)
  _id: number;

  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  password: string;
}

@InputType()
export class ModifyFriendListInput {
  @Field(type=> Int)
  userId: number;

  @Field(type=> Int)
  friendId: number;
}