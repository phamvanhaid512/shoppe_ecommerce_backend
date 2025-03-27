import { Body, Controller, Injectable, Post } from '@nestjs/common';
import { registerDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { Connection } from 'typeorm';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private connection: Connection,
  ) {}

  @Post('/signUp')
  async signUp(@Body() userDto: registerDto) {
    return await this.connection.transaction((transactionManager) => {
      return this.authService.signUp(transactionManager, userDto);
    });
  }
}
