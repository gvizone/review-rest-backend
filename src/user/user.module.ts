import { Module } from '@nestjs/common';
import { UserRepositoryMock } from './infrastructure/user.repository.mock';
import { USER_REPOSITORY } from './domain/user.repository.token';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepositoryMock,
    },
  ],
  exports: [UserService],
})
export class UserModule {}
