import { Controller, Get, Request, Post, UseGuards, Body } from '@nestjs/common';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Post()
  postCreate(@Body() body) {
    this.usersService.create(body);
    return { status: 'ok' };
  }
}
