import { Module } from '@nestjs/common';
import { ReviewModule } from '../review/review.module';
import { UserModule } from '../user/user.module';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
  imports: [UserModule, ReviewModule],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
