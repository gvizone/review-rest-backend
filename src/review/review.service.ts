import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
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

  create(dto: CreateReviewDto): Promise<Review> {
    return this.reviewRepository.create({
      user: {
        id: randomUUID(),
        name: dto.user.name,
        email: dto.user.email,
        address: dto.user.address,
      },
      restaurant: {
        id: randomUUID(),
        name: dto.restaurant.name,
        address: dto.restaurant.address,
        categories: dto.restaurant.categories,
        instagram: dto.restaurant.instagram,
        images: dto.restaurant.images,
      },
      note: dto.note,
      commentary: dto.commentary,
      images: dto.images,
    });
  }
}
