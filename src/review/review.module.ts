import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from '../restaurant/domain/restaurant.entity';
import { User } from '../user/domain/user.entity';
import { REVIEW_REPOSITORY } from './domain/review.repository.token';
import { Review } from './domain/review.entity';
import { ReviewTypeOrmRepository } from './infrastructure/review.repository.typeorm';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';

@Module({
  imports: [TypeOrmModule.forFeature([Review, User, Restaurant])],
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
