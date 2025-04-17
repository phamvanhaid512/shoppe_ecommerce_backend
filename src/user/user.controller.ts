import { Controller, Get, UseGuards, Request, Req } from '@nestjs/common';
import { Connection } from 'typeorm';
import { UserService } from './user.service';
import { SessionGuard } from '../auth/guards/session.guards';
import { response } from 'express';
@Controller('user')
export class UserController {
  constructor(
    private readonly connection: Connection,
    private readonly userService: UserService,
  ) {}

  @UseGuards(SessionGuard)
  @Get('/getProfile')
  async getProfile(@Req() request: Request) {
    return await this.connection.transaction((transactionManager) => {
      return this.userService.getProfile(transactionManager);
    });
  }
}
