import { Get, Injectable, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/auth/entity/user.entity';
import { EntityManager, Repository } from 'typeorm';
import { SessionGuard } from 'src/auth/guards/session.guards';
import { UserRepository } from './repository/user.repository';
@Injectable()
export class UserService {
  constructor(private readonly usersRepository: UserRepository) { }

  async getProfile(transactionManager: EntityManager) {
    try {
      const result = await this.usersRepository.getProfile(transactionManager);
      return { status: 200, data: result };
    } catch (error) {
      throw error;
    }
  }
}
