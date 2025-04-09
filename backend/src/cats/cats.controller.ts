import { Controller, Get, Request, Post, UseGuards, Body } from '@nestjs/common';

import { CatsService } from './cats.service';

@Controller('cats')
export class CatsController {
  constructor(private catsService: CatsService) {}
  @Get('/')
  async getCats(@Request() req) {
    return this.catsService.findAll();
  }
  @Post('/')
  async newCat(@Request() req, @Body() body) {
    console.log('body', body);
    console.log('req', req);
    return this.catsService.create(body);
  }
}
