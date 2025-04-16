import { Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '../../users/models/user.model';

export type GameDocument = HydratedDocument<Game>;
export type GameLogDocument = HydratedDocument<GameLog>;

@ObjectType()
@Schema()
export class Game {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field()
  @Prop()
  name: string;

  @Field()
  @Prop()
  description: string;

  @Field(() => [String])
  @Prop({ type: [String] })
  rules: string[];

  @Field(() => User)
  @Prop({ type: Types.ObjectId, ref: 'User' })
  owner: User;

  @Field(() => User)
  @Prop({ type: Types.ObjectId, ref: 'User' })
  gameMaster: User;

  @Field(() => [User])
  @Prop({ type: [Types.ObjectId], ref: 'User' })
  spectators: User[];

  @Field(() => [User])
  @Prop({ type: [Types.ObjectId], ref: 'User' })
  players: User[];

  @Field(() => [ID])
  @Prop({ type: [Types.ObjectId] })
  gameLogs: Types.ObjectId[];
}

@ObjectType()
@Schema()
export class GameLog {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field()
  @Prop()
  event_type: string;

  @Field()
  @Prop()
  name: string;

  @Field(() => [String])
  @Prop()
  description: string[];

  @Field()
  @Prop()
  time: Date;
}

export const GameSchema = SchemaFactory.createForClass(Game);
export const GameLogSchema = SchemaFactory.createForClass(GameLog);