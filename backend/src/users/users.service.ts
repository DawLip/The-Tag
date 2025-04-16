import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './models/user.model';
import { RegisterInput, ModifyFriendListInput } from "./DTO/user.input";

export type U = any;

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
    async create(registerInput: RegisterInput): Promise<U> {
      const createdUser = new this.userModel({
        ...registerInput,
        friends: [2]
      });

      return createdUser.save();
    }
  
    async findOneById(id: number): Promise<U | undefined> {
      return await this.userModel.findOne({id: id}).exec();
    }
    async findOneByEmail(email: string): Promise<U | undefined> {
      return await this.userModel.findOne({email: email}).exec();
    }

    async findAllFriends(user:User): Promise<U | undefined> {
      return await this.userModel.find({id:{"$in": user.friends}}).exec();
    }
    async addFriend({userId, friendId}:ModifyFriendListInput): Promise<U | undefined> {
      const res = await this.userModel.updateOne({id:userId}, {
        $push: { friends: friendId }
      }).exec();

      if (res.modifiedCount === 0) return { status: "USER_NOT_FOUND" }
      return { status: "SUCCESS" }
    }

    async removeFriend({userId, friendId}:ModifyFriendListInput): Promise<U | undefined> {
      const res = await this.userModel.updateOne({id:userId}, {
        $pull: { friends: friendId }
      }).exec();
      
      if (res.modifiedCount === 0) return { status: "USER_NOT_FOUND" }
      return { status: "SUCCESS" }
    }
}
