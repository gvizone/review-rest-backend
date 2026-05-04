import { CategoryDto } from '../../common/dto/category.dto';
import { Restaurant } from './restaurant.entity';
import { DeleteResult } from 'typeorm';

export type RestaurantSearchPage = {
  items: Restaurant[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
};

export interface RestaurantRepository {
  findAll(): Promise<Restaurant[]>;
  searchPaginated(
    q: string,
    page: number,
    limit: number,
  ): Promise<RestaurantSearchPage>;
  findById(id: string): Promise<Restaurant | null>;
  findByCategory(categoryName: string): Promise<Restaurant[]>;
  findCategories(): Promise<CategoryDto[]>;
  create(data: Omit<Restaurant, 'id'> & { id?: string }): Promise<Restaurant>;
  update(
    id: string,
    data: Partial<Omit<Restaurant, 'id'>> & {
      address?: Partial<Restaurant['address']>;
    },
  ): Promise<Restaurant | null>;
  deleteAll(): Promise<DeleteResult>;
}
