import { CategoryDto } from '../../common/dto/category.dto';
import { Restaurant } from './restaurant.entity';
import { DeleteResult } from 'typeorm';

export interface RestaurantRepository {
  findAll(): Promise<Restaurant[]>;
  findById(id: string): Promise<Restaurant | null>;
  findByCategory(categoryName: string): Promise<Restaurant[]>;
  findCategories(): Promise<CategoryDto[]>;
  create(data: Omit<Restaurant, 'id'>): Promise<Restaurant>;
  deleteAll(): Promise<DeleteResult>;
}
