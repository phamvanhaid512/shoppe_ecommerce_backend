import { Injectable, Logger } from '@nestjs/common';
import { AuthRepository } from './repository/auth.repository';
import { registerDto } from './dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, EntityRepository, Repository } from 'typeorm';
import { UserEntity } from './entity/user.entity';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthRepository)
    private authRepository: AuthRepository,
  ) {}
  async signUp(transactionManager: EntityManager, userDto: registerDto) {
    const result = await this.authRepository.signUp(
      transactionManager,
      userDto,
    );
    return { statusCode: 200, data: result };
  }
}
