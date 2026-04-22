import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Review } from '../domain/review.entity';
import { ReviewRepository } from '../domain/review.repository';

@Injectable()
export class ReviewRepositoryMock implements ReviewRepository {
  private readonly store = new Map<string, Review>();

  findAll(): Promise<Review[]> {
    return Promise.resolve([...this.store.values()]);
  }

  findById(id: string): Promise<Review | null> {
    return Promise.resolve(this.store.get(id) ?? null);
  }

  create(data: Omit<Review, 'id'>): Promise<Review> {
    const entity: Review = { id: randomUUID(), ...data };
    this.store.set(entity.id, entity);
    return Promise.resolve(entity);
  }
}
