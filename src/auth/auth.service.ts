import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from './repository/auth.repository';
import { RegisterDto } from './dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, EntityRepository, Repository } from 'typeorm';
import { UserEntity } from './entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import bcrypt from 'bcryptjs'; // Thay vì 'bcrypt'
import { LoginDto } from './dto/login.dto';
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
    return { statusCode: 201, data: result };
  }

  async login(transactionManager: EntityManager, userDto: LoginDto) {
    const { name, password } = userDto;
    const user = await transactionManager.getRepository(UserEntity).findOne({
      name,
    });
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...payload } = user;
      const accessToken = await this.jwtService.sign(payload);

      return {
        statusCode: 201,
        message: 'Đăng nhập thành công.',
        data: {
          data: payload,
          accessToken: accessToken,
        },
      };
    }
  }
}
