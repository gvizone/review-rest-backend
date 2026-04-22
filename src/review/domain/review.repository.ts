import { Review } from './review.entity';

export interface ReviewRepository {
  findAll(): Promise<Review[]>;
  findById(id: string): Promise<Review | null>;
  create(data: Omit<Review, 'id'>): Promise<Review>;
}
