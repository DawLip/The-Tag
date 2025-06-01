import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './models/user.model';
import { RegisterInput, ModifyFriendListInput, GetUserInput, ChangePassowordViaEmailInput, ChangePassowordInput, ChangeEmailInput } from "./dto/user.input";
import { UserWithToken } from './dto/user.dto';
import { JwtService } from '@nestjs/jwt';

export type U = any;

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async create(input: RegisterInput): Promise<User> {
    const createdUser = new this.userModel(input);
    return await createdUser.save();
  }
  async register(input: RegisterInput):Promise<UserWithToken|null> {
    const user = await this.create(input);
    const access_token = await this.jwtService.sign({_id: user._id})
    return { status: "SUCCESS", access_token, user };
  }

  async changePassword({userID, newPassword, oldPassword}: ChangePassowordInput):Promise<any> {
    const user = await this.findOneById(userID);
    
    if(!user || user.password!=oldPassword)  return { status: "WRONG_EMAIL_OR_PASSWORD" };
    this.userModel.updateOne({ userID }, { password: newPassword }).exec();

    return { status: "SUCCESS" };
  }
  
  async changePasswordViaEmail({email, resetPasswordToken, newPassword}: ChangePassowordViaEmailInput):Promise<any> {
    console.log('changePasswordViaEmail')
    const user = await this.findOneByEmail(email);

    if(!user) return { status: "EMAIL_NOT_FOUND" };
    if(resetPasswordToken!=user._id) return { status: "WRONG_RESET_PASSWORD_TOKEN" };

    this.userModel.updateOne({ _id: user._id }, { password: newPassword }).exec();

    return { status: "SUCCESS" };
  }

  async changeEmail({userID, newEmail, password}: ChangeEmailInput):Promise<any> {
    const user = await this.findOneById(userID);

    if(!user || user.password!=password) return { status: "WRONG_EMAIL_OR_PASSWORD" };
    await this.userModel.updateOne({ userID }, { email: newEmail }).exec();

    return { status: "SUCCESS" };
  }
  
  async findOne({_id, email}:GetUserInput): Promise<U | undefined | null> {
    if(_id)   return this.findOneById(_id);
    if(email) return this.findOneByEmail(email);
    return null;
  }
  async findOneById(_id: string): Promise<U | undefined> {
    console.log(_id)
    return await this.userModel.findOne({_id: _id}).exec();
  }
  async findOneByEmail(email: string): Promise<U | undefined> {
    return await this.userModel.findOne({email: email}).exec();
  }
  async findById(users:string[]): Promise<U | undefined> {
    return await this.userModel.find({_id:{"$in": users}}).exec();
  }

  async findAllFriends(user:User): Promise<U | undefined> {
    return await this.userModel.find({_id:{"$in": user.friends}}).exec();
  }
  async addFriend({userId, friendId}:ModifyFriendListInput): Promise<U | undefined> {
    console.log("=== addFriend ===");
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

  async resetPassword(email:string): Promise<any> {
    const user = await this.findOneByEmail(email);
    console.log(email)
    console.log(user)

    const transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false,
      auth: {
        user: '8dd27a001@smtp-brevo.com',
        pass: 'Kv9RAtsw0M1qP46O', 
      },
    });

    const res = await transporter.sendMail({
      from: 'd.lipinski022@gmail.com',
      to: email,
      subject: 'The Tag - Reset password',
      text: `Oto twój kod do resetowania hasła: ${user._id}`,
    });

    console.log(res)

    return { status: "SUCCESS" };
  }
}
