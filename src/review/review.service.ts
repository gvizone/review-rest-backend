import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { RestaurantService } from '../restaurant/restaurant.service';
import { UserService } from '../user/user.service';
import { Review } from './domain/review.entity';
import type { ReviewRepository } from './domain/review.repository';
import { REVIEW_REPOSITORY } from './domain/review.repository.token';
import { CreateReviewDto } from './dto/create-review.dto';
import { DeleteResult } from 'typeorm';

@Injectable()
export class ReviewService {
  constructor(
    @Inject(REVIEW_REPOSITORY)
    private readonly reviewRepository: ReviewRepository,
    private readonly userService: UserService,
    private readonly restaurantService: RestaurantService,
  ) {}

  findAll(): Promise<Review[]> {
    return this.reviewRepository.findAll();
  }

  async findById(id: string): Promise<Review> {
    const review = await this.reviewRepository.findById(id);
    if (!review) {
      throw new NotFoundException(`Review ${id} not found`);
    }
    return review;
  }

  deleteAll(): Promise<DeleteResult> {
    return this.reviewRepository.deleteAll();
  }

  async create(dto: CreateReviewDto): Promise<Review> {
    const user = await this.userService.findById(dto.userId);
    const restaurant = await this.restaurantService.findById(dto.restaurantId);
    return this.reviewRepository.create({
      user,
      restaurant,
      note: dto.note,
      commentary: dto.commentary,
      images: dto.images,
    });
  }
}
