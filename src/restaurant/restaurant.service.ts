import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Restaurant } from './domain/restaurant.entity';
import type { RestaurantRepository } from './domain/restaurant.repository';
import { RESTAURANT_REPOSITORY } from './domain/restaurant.repository.token';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { CategoryDto } from 'src/common/dto/category.dto';

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

  async findByCategory(categoryName: string): Promise<Restaurant[]> {
    const restaurants =
      await this.restaurantRepository.findByCategory(categoryName);
    if (!restaurants) {
      throw new NotFoundException(`Category ${categoryName} not found`);
    }
    return restaurants;
  }

  async findCategories(): Promise<CategoryDto[]> {
    const categories = await this.restaurantRepository.findCategories();
    return categories;
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
