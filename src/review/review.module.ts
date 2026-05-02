import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantModule } from '../restaurant/restaurant.module';
import { UserModule } from '../user/user.module';
import { REVIEW_REPOSITORY } from './domain/review.repository.token';
import { Review } from './domain/review.entity';
import { ReviewTypeOrmRepository } from './infrastructure/review.repository.typeorm';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Review]),
    UserModule,
    RestaurantModule,
  ],
  controllers: [ReviewController],
  providers: [
    ReviewService,
    {
      provide: REVIEW_REPOSITORY,
      useClass: ReviewTypeOrmRepository,
    },
  ],
})
export class ReviewModule {}
