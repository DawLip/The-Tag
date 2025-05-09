import { Types, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { User } from '../../users/models/user.model';
import GraphQLJSON from 'graphql-type-json';

@ObjectType()
@Schema()
export class Player {
  @Field(() => User)
  @Prop({ type: Types.ObjectId, ref: 'User' })
  playerId: string;

  @Field(() => Int)
  @Prop({ type: Number })
  role: number;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);