import { Module } from '@nestjs/common';
import { ReviewRepositoryMock } from './infrastructure/review.repository.mock';
import { REVIEW_REPOSITORY } from './domain/review.repository.token';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';

@Module({
  controllers: [ReviewController],
  providers: [
    ReviewService,
    {
      provide: REVIEW_REPOSITORY,
      useClass: ReviewRepositoryMock,
    },
  ],
})
export class ReviewModule {}
