import { Module } from '@nestjs/common';
import { LogoutTokenService } from './logout-token.service';
import { LogoutTokenController } from './logout-token.controller';

@Module({
  providers: [LogoutTokenService],
  controllers: [LogoutTokenController],
  exports: [LogoutTokenService],
})
export class LogoutTokenModule {}
