import { Address } from '../../common/types/address';

export interface Restaurant {
  id: string;
  name: string;
  address: Address;
  categories: Record<string, string>;
  instagram?: string;
  images: string[];
}
