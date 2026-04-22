import { CategoryDto } from '../../common/dto/category.dto';
import { Address } from '../../common/types/address';

export interface Restaurant {
  id: string;
  name: string;
  address: Address;
  categories: CategoryDto[];
  instagram?: string;
  images?: string[];
}
