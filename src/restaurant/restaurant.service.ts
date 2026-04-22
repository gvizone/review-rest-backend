import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Restaurant } from './domain/restaurant.entity';
import type { RestaurantRepository } from './domain/restaurant.repository';
import { RESTAURANT_REPOSITORY } from './domain/restaurant.repository.token';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';

@Injectable()
export class RestaurantService {
  constructor(
    @Inject(RESTAURANT_REPOSITORY)
    private readonly restaurantRepository: RestaurantRepository,
  ) {}

  findAll(): Promise<Restaurant[]> {
    return this.restaurantRepository.findAll();
  }

  async findById(id: string): Promise<Restaurant> {
    const restaurant = await this.restaurantRepository.findById(id);
    if (!restaurant) {
      throw new NotFoundException(`Restaurant ${id} not found`);
    }
    return restaurant;
  }

  create(dto: CreateRestaurantDto): Promise<Restaurant> {
    return this.restaurantRepository.create({
      name: dto.name,
      address: dto.address,
      categories: dto.categories,
      instagram: dto.instagram,
      images: dto.images,
    });
  }
}
