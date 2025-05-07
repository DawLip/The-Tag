import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class JoinGameInput {
  @Field(type=> String)
  gameCode: string;

  @Field(type=> Int, {nullable: true})
  _id?: string;

}