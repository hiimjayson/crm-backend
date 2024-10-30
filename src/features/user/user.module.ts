import { Module } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { SessionService } from '../auth/session.service';

@Module({
  controllers: [UserController],
  providers: [UserRepository, UserService, SessionService],
  exports: [UserRepository],
})
export class UserModule {}
