import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { User } from '../domain/user.entity';
import { UserRepository } from '../domain/user.repository';

@Injectable()
export class UserRepositoryMock implements UserRepository {
  private readonly store = new Map<string, User>();

  findAll(): Promise<User[]> {
    return Promise.resolve([...this.store.values()]);
  }

  findById(id: string): Promise<User | null> {
    return Promise.resolve(this.store.get(id) ?? null);
  }

  create(data: Omit<User, 'id'>): Promise<User> {
    const entity: User = { id: randomUUID(), ...data };
    this.store.set(entity.id, entity);
    return Promise.resolve(entity);
  }
}
