import { Restaurant } from './restaurant.entity';

export interface RestaurantRepository {
  findAll(): Promise<Restaurant[]>;
  findById(id: string): Promise<Restaurant | null>;
  create(data: Omit<Restaurant, 'id'>): Promise<Restaurant>;
}
