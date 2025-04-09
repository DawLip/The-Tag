
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && user.password === pass) {
      return user._doc;
    }
    return null;
  }

  async login(user: any) {
    const loginedUser = await this.validateUser(user.email, user.password);
    if (!loginedUser) {
      return {
        status: 'INVALID_CREDENTIALS',
        access_token: null,
        user: null,
      }
    }
    
    return {
      status: 'SUCCESS',
      access_token: this.jwtService.sign({id: loginedUser.id}),
      user: {...loginedUser}
    };
  }
}
