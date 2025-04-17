import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { LogoutTokenEntity } from './logout-token.entity';

@Injectable()
export class LogoutTokenService {
  async addToken(transactionManager: EntityManager, token: string) {
    const logoutToken = transactionManager.create(LogoutTokenEntity, { token });

    try {
      await transactionManager.save(logoutToken);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(`Lỗi trong quá trình đăng xuất.`);
    }

    return { statusCode: 201, message: 'Đăng xuất thành công.' };
  }
}
