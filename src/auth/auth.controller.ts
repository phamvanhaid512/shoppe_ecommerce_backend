import { Body, Controller, Injectable, Post } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { Connection } from 'typeorm';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private connection: Connection,
  ) {}

  @Post('/signUp')
  async signUp(@Body() userDto: RegisterDto) {
    return await this.connection.transaction((transactionManager) => {
      return this.authService.signUp(transactionManager, userDto);
    });
  }
  @Post('login')
  async login(@Body() userDto: LoginDto) {
    return await this.connection.transaction((transactionManager) => {
      return this.authService.login(transactionManager, userDto);
    });
  }
}
