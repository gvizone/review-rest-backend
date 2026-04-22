import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Restaurant } from '../domain/restaurant.entity';
import { RestaurantRepository } from '../domain/restaurant.repository';
import { CategoryDto } from 'src/common/dto/category.dto';

@Injectable()
export class RestaurantRepositoryMock implements RestaurantRepository {
  private readonly store = new Map<string, Restaurant>();

  findCategories(): Promise<CategoryDto[]> {
    return Promise.resolve(
      Array.from(this.store.values()).flatMap(
        (restaurant) => restaurant.categories,
      ),
    );
  }

  findByCategory(categoryName: string): Promise<Restaurant[]> {
    const restaurants = Array.from(this.store.values()).filter((restaurant) =>
      restaurant.categories.some((category) => category.name === categoryName),
    );
    return Promise.resolve(restaurants);
  }

  findAll(): Promise<Restaurant[]> {
    return Promise.resolve([...this.store.values()]);
  }

  findById(id: string): Promise<Restaurant | null> {
    return Promise.resolve(this.store.get(id) ?? null);
  }

  create(data: Omit<Restaurant, 'id'>): Promise<Restaurant> {
    const entity: Restaurant = { id: randomUUID(), ...data };
    this.store.set(entity.id, entity);
    return Promise.resolve(entity);
  }
}
