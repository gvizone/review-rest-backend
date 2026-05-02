import { User } from './user.entity';
import { DeleteResult } from 'typeorm';

export interface UserRepository {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: Omit<User, 'id'>): Promise<User>;
  updateImage(id: string, image: string | null): Promise<User | null>;
  deleteAll(): Promise<DeleteResult>;
}
