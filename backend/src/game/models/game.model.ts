import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, Schema as MongooseSchema } from 'mongoose';
import GraphQLJSON from 'graphql-type-json';

import { User } from '../../users/models/user.model';
import { Player, PlayerSchema } from './player.model';

/* Typy dokumentów */
export type GameDocument = HydratedDocument<Game>;
export type GameLogDocument = HydratedDocument<GameLog>;
export type EffectorDocument = HydratedDocument<Effector>;
export type AreaDocument = HydratedDocument<Area>;

/* Area */
@ObjectType()
@Schema()
export class Area {
  @Field()
  @Prop()
  type: string;

  @Field(() => GraphQLJSON)
  @Prop({ type: MongooseSchema.Types.Mixed })
  points: any[];
}
export const AreaSchema = SchemaFactory.createForClass(Area);

/* Skill */
@ObjectType()
@Schema()
export class Skill {
  @Field()
  @Prop()
  type: string;

  @Field()
  @Prop()
  description: string;

  @Field(() => [Area])
  @Prop({ type: [AreaSchema] })
  area: Area[];

  @Field()
  @Prop()
  cooldown: number;

  @Field()
  @Prop()
  uses: number;
 
  @Field()
  @Prop()
  duration: number;

  @Field()
  @Prop()
  waitToStart: number;

  @Field(() => [String])
  @Prop({ type: [String] })
  affectedClasses: string[];

  @Field(() => [String])
  @Prop({ type: [String] })
  classes: string[];
}
export const SkillSchema = SchemaFactory.createForClass(Skill);

/* Effector */
@ObjectType()
@Schema()
export class Effector {
  @Field()
  @Prop()
  type: string;

  @Field(() => [Area])
  @Prop({ type: [AreaSchema] })
  area: Area[];

  @Field()
  @Prop()
  startTime: Date;

  @Field()
  @Prop()
  duration: number;

  @Field(() => [String])
  @Prop({ type: [String] })
  affectedClasses: string[];
}
export const EffectorSchema = SchemaFactory.createForClass(Effector);

/* Game */
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

  @Field()
  @Prop()
  status: string;

  @Field()
  @Prop()
  gameCode: string;

  @Field(() => [String])
  @Prop({ type: [String] })
  rules: string[];

  @Field(() => GraphQLJSON)
  @Prop({ type: MongooseSchema.Types.Mixed })
  settings: Record<string, any>;

  @Field(() => GraphQLJSON)
  @Prop({ type: MongooseSchema.Types.Mixed })
  events: Record<string, any>;

  @Field(() => Area)
  @Prop({ type: AreaSchema })
  border: Area;

  @Field(() => User)
  @Prop({ type: Types.ObjectId, ref: 'User' })
  owner: Types.ObjectId;

  @Field(() => User, { nullable: true })
  @Prop({ type: Types.ObjectId, ref: 'User' })
  gameMaster: Types.ObjectId;

  @Field(() => [Effector])
  @Prop({ type: [EffectorSchema] })
  skills: Effector[];

  @Field(() => [Effector])
  @Prop({ type: [EffectorSchema] })
  effectors: Effector[];

  @Field(() => [Player])
  @Prop({ type: [PlayerSchema] })
  players: Player[];

  @Field(() => [ID])
  @Prop({ type: [Types.ObjectId], ref: 'GameLog' })
  gameLogs: Types.ObjectId[];
}
export const GameSchema = SchemaFactory.createForClass(Game);

/* GameLog */
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
export const GameLogSchema = SchemaFactory.createForClass(GameLog);
