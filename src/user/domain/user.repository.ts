import { User } from './user.entity';

export interface UserRepository {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  create(data: Omit<User, 'id'>): Promise<User>;
}
