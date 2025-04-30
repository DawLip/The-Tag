import { Controller, Get, Request } from '@nestjs/common';
import { Public } from './auth/auth.public';

@Controller()
export class AppController {
  @Public()
  @Get('/health-check')
  async getRoot(@Request() req) {
    console.log("=== health-check ===")
    return {status: "OK"};
  }
}
