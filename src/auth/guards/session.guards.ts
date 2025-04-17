import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import { UserEntity } from '../entity/user.entity';
import { LogoutTokenEntity } from 'src/logout-token/logout-token.entity';
import { getRepository } from 'typeorm';

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const token = request.headers['authorization'];
    console.log("token", token);
    if (!token) {
      throw new UnauthorizedException();
    }
    request.token = await this.validateToken(token, response);

    request.user = await getRepository(UserEntity).findOne({
      id: request.token.id,
      email: request.token.email,
    });
    return true;
  }

  async validateToken(auth: string, response) {
    if (auth.split(' ')[0] !== 'Bearer') {
      throw new UnauthorizedException('Invalid token');
    }
    const token = auth.split(' ')[1];
    const logoutToken = await getRepository(LogoutTokenEntity).findOne({ token });
    if (logoutToken) {
      throw new UnauthorizedException('Invalid token');
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded;
    } catch (error) {
      if (error.name == 'TokenExpiredError') {
        // response.redirect('dang-nhap');
        throw new UnauthorizedException(error.name);
      }
      const message = 'Token error: ' + (error.message || error.name);
      throw new UnauthorizedException(message);
    }
  }
}
