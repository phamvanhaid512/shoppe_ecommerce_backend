import { EntityManager, EntityRepository, Repository } from 'typeorm';
import { UserEntity } from 'src/auth/entity/user.entity';
import { LoginDto } from 'src/auth/dto/login.dto';
import { RegisterDto } from 'src/auth/dto/register.dto';
import axios from 'axios';
import { getConnection } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  async getProfile(transactionManager: EntityManager) {
    try {
      return await transactionManager.find(UserEntity);
    } catch (error) {
      throw error;
    }
  }

  async findOneUser(transactionManager: EntityManager, name: string) {
    try {
      return await transactionManager.findOne(UserEntity, { where: { name } });
    } catch (error) {
      throw error;
    }
  }
}
