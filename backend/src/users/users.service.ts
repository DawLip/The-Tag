import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './models/user.model';
import { RegisterInput, ModifyFriendListInput, GetUserInput } from "./dto/user.input";

export type U = any;

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(input: RegisterInput): Promise<U> {
    const createdUser = new this.userModel(input);
    return createdUser.save();
  }
  
  async findOne({_id, email}:GetUserInput): Promise<U | undefined | null> {
    if(_id)   return this.findOneById(_id);
    if(email) return this.findOneByEmail(email);
    return null;
  }
  async findOneById(_id: number): Promise<U | undefined> {
    return await this.userModel.findOne({_id: _id}).exec();
  }
  async findOneByEmail(email: string): Promise<U | undefined> {
    return await this.userModel.findOne({email: email}).exec();
  }

  async findAllFriends(user:User): Promise<U | undefined> {
    return await this.userModel.find({_id:{"$in": user.friends}}).exec();
  }
  async addFriend({userId, friendId}:ModifyFriendListInput): Promise<U | undefined> {
    const res = await this.userModel.updateOne({_id:userId}, {
      $push: { friends: friendId }
    }).exec();

    if (res.modifiedCount === 0) return { status: "USER_NOT_FOUND" }
    return { status: "SUCCESS" }
  }
  async removeFriend({userId, friendId}:ModifyFriendListInput): Promise<U | undefined> {
    const res = await this.userModel.updateOne({_id: userId}, {
      $pull: { friends: friendId }
    }).exec();
    
    if (res.modifiedCount === 0) return { status: "USER_NOT_FOUND" }
    return { status: "SUCCESS" }
  }
}
