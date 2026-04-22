import { Address } from '../../common/types/address';

export interface User {
  id: string;
  name: string;
  email: string;
  address: Address;
}
