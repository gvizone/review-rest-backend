import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Restaurant } from './domain/restaurant.entity';
import type { RestaurantRepository } from './domain/restaurant.repository';
import { RESTAURANT_REPOSITORY } from './domain/restaurant.repository.token';
import { BulkImportRestaurantsDto } from './dto/bulk-import-restaurants.dto';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { CategoryDto } from 'src/common/dto/category.dto';
import { DeleteResult } from 'typeorm';

@Injectable()
export class RestaurantService {
  constructor(
    @Inject(RESTAURANT_REPOSITORY)
    private readonly restaurantRepository: RestaurantRepository,
  ) {}

  findAll(): Promise<Restaurant[]> {
    return this.restaurantRepository.findAll();
  }

  searchPaginated(q: string, page: number, limit: number) {
    const safePage = Number.isFinite(page) && page >= 1 ? Math.floor(page) : 1;
    const safeLimit = Number.isFinite(limit)
      ? Math.min(50, Math.max(1, Math.floor(limit)))
      : 10;
    return this.restaurantRepository.searchPaginated(q ?? '', safePage, safeLimit);
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

  deleteAll(): Promise<DeleteResult> {
    return this.restaurantRepository.deleteAll();
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

  async bulkCreate(dto: BulkImportRestaurantsDto): Promise<Restaurant[]> {
    const created: Restaurant[] = [];
    for (const item of dto.items) {
      const { id, ...rest } = item;
      const row = await this.restaurantRepository.create({
        ...(id ? { id } : {}),
        name: rest.name,
        address: rest.address,
        categories: rest.categories,
        instagram: rest.instagram,
        images: rest.images,
      });
      created.push(row);
    }
    return created;
  }
}
