import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { DeleteResult, Repository } from 'typeorm';
import { User } from '../domain/user.entity';
import { UserRepository } from '../domain/user.repository';

@Injectable()
export class UserTypeOrmRepository implements UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.repo.find();
  }

  findById(id: string): Promise<User | null> {
    return this.repo.findOne({ where: { id } });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } });
  }

  create(data: Omit<User, 'id'>): Promise<User> {
    const entity = this.repo.create({
      id: randomUUID(),
      ...data,
    });
    return this.repo.save(entity);
  }

  async updateImage(id: string, image: string | null): Promise<User | null> {
    const existing = await this.findById(id);
    if (!existing) return null;
    if (image === null) {
      await this.repo
        .createQueryBuilder()
        .update(User)
        .set({ image: null } as any)
        .where('id = :id', { id })
        .execute();
    } else {
      existing.image = image;
      await this.repo.save(existing);
    }
    return this.findById(id);
  }

  deleteAll(): Promise<DeleteResult> {
    return this.repo.deleteAll();
  }
}
