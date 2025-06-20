import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';
import { User } from '../models/user.model';

@InputType()
export class GetUserInput {
  @Field(type => ID, { nullable: false })
  _id?: string;

  @Field(type=> String, { nullable: true })
  email?: string;
}

@InputType()
export class LoginInput {
  @Field()
  email: string;

  @Field()
  password: string;
}

@InputType()
export class RegisterInput {
  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  password: string;
}

@InputType()
export class ChangePassowordInput {
  @Field()
  userID: string;

  @Field()
  newPassword: string;

  @Field()
  oldPassword: string;
}

@InputType()
export class ChangePassowordViaEmailInput {
  @Field()
  email: string;

  @Field()
  resetPasswordToken: string;

  @Field()
  newPassword: string;
}

@InputType()
export class ChangeEmailInput {
  @Field()
  userID: string;

  @Field()
  newEmail: string;

  @Field()
  password: string;
}

@InputType()
export class ModifyFriendListInput {
  @Field(type => ID, { nullable: true })
  userId: string;

  @Field(type => ID, { nullable: false })
  friendId: string;
}