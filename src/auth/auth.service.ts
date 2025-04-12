import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from './repository/auth.repository';
import { RegisterDto } from './dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, EntityRepository, Repository } from 'typeorm';
import { UserEntity } from './entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import bcrypt from 'bcryptjs'; // Thay vì 'bcrypt'
@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    @InjectRepository(AuthRepository)
    private authRepository: AuthRepository,
    private jwtService: JwtService,
  ) {}
  async signUp(transactionManager: EntityManager, userDto: RegisterDto) {
    const result = await this.authRepository.signUp(
      transactionManager,
      userDto,
    );
    return { statusCode: 200, data: result };
  }

  async validateUser(name: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(name);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(user: any) {
    const payload = { name: user.name, sub: user.id };
    return {
      payload,
      access_token: this.jwtService.sign(payload),
    };
  }
}
