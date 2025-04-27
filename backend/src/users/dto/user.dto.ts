import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../models/user.model'; 

@ObjectType()
export class UserWithToken {
  @Field(() => String)
  status: string;

  @Field(() => User, { nullable: true })
  user: User|null;

  @Field(() => String, { nullable: true })
  access_token: string|null;
}

@ObjectType()
export class Status {
  @Field(() => String)
  status: string;
}