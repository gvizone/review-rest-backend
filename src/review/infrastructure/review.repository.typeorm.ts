import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { DeleteResult, Repository } from 'typeorm';
import { Review } from '../domain/review.entity';
import { ReviewRepository } from '../domain/review.repository';

@Injectable()
export class ReviewTypeOrmRepository implements ReviewRepository {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,
  ) {}

  findAll(): Promise<Review[]> {
    return this.reviewRepo.find();
  }

  findById(id: string): Promise<Review | null> {
    return this.reviewRepo.findOne({ where: { id } });
  }

  deleteAll(): Promise<DeleteResult> {
    return this.reviewRepo.deleteAll();
  }

  async create(data: Omit<Review, 'id'>): Promise<Review> {
    const review = this.reviewRepo.create({
      id: randomUUID(),
      user: data.user,
      restaurant: data.restaurant,
      note: {
        service: data.note.service,
        food: data.note.food,
        value: data.note.value,
        atmosphere: data.note.atmosphere,
      },
      commentary: data.commentary,
      images: data.images,
    });
    await this.reviewRepo.save(review);

    const full = await this.findById(review.id);
    if (!full) {
      throw new Error('Review was not found after save');
    }
    return full;
  }
}
