import { EntityManager, Repository, EntityRepository } from 'typeorm';
import { UserEntity } from '../entity/user.entity';
import { registerDto } from '../dto/register.dto';
import bcrypt from 'bcryptjs'; // Thay vì 'bcrypt'
import { InternalServerErrorException, Logger } from '@nestjs/common';

@EntityRepository(UserEntity)
export class AuthRepository extends Repository<UserEntity> {
  async signUp(transactionManager: EntityManager, userDto: registerDto) {
    try {
      const { email, name, password } = userDto;
      const salts = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(password, salts);

      const result = transactionManager.create(UserEntity, {
        email,
        name,
        password: hashPassword,
      });
      try {
        return await transactionManager.save(result);
      } catch (error) {
        Logger.error(error);
        throw new InternalServerErrorException(
          'Lỗi hệ thống trong quá trình tạo người dùng, vui lòng thử lại sau.',
        );
      }
    } catch (error) {
      throw error;
    }
  }
}
