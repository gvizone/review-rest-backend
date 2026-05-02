import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { DeleteResult, Repository } from 'typeorm';
import { Restaurant } from '../../restaurant/domain/restaurant.entity';
import { User } from '../../user/domain/user.entity';
import { Review } from '../domain/review.entity';
import { ReviewRepository } from '../domain/review.repository';

@Injectable()
export class ReviewTypeOrmRepository implements ReviewRepository {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Restaurant)
    private readonly restaurantRepo: Repository<Restaurant>,
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
    const userEntity = this.userRepo.create({
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      address: data.user.address,
    });
    await this.userRepo.save(userEntity);

    const restaurantEntity = this.restaurantRepo.create({
      id: data.restaurant.id,
      name: data.restaurant.name,
      address: data.restaurant.address,
      categories: data.restaurant.categories,
      instagram: data.restaurant.instagram,
      images: data.restaurant.images,
    });
    await this.restaurantRepo.save(restaurantEntity);

    const review = this.reviewRepo.create({
      id: randomUUID(),
      user: userEntity,
      restaurant: restaurantEntity,
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
