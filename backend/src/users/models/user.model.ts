import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@ObjectType()  
@Schema()     
export class User {
  @Field(() => ID)
  @Prop({ type: Types.ObjectId })
  _id: Types.ObjectId;

  @Field()
  @Prop()
  username: string;

  @Field()
  @Prop()
  email: string;

  @Field()
  @Prop()
  password: string;

  @Field(() => [User]) 
  @Prop({ type: [Types.ObjectId], ref: 'User' })
  friends: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);