import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Restaurant } from '../domain/restaurant.entity';
import { RestaurantRepository } from '../domain/restaurant.repository';

@Injectable()
export class RestaurantRepositoryMock implements RestaurantRepository {
  private readonly store = new Map<string, Restaurant>();

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
