import { Restaurant } from '../../restaurant/domain/restaurant.entity';
import { User } from '../../user/domain/user.entity';

export interface ReviewNote {
  service: number;
  food: number;
  value: number;
  atmosphere: number;
}

export interface Review {
  id: string;
  user: User;
  restaurant: Restaurant;
  note: ReviewNote;
  commentary?: string;
  images: string[];
}
