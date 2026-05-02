import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { DeleteResult, Repository } from 'typeorm';
import { CategoryDto } from '../../common/dto/category.dto';
import { Restaurant } from '../domain/restaurant.entity';
import { RestaurantRepository } from '../domain/restaurant.repository';

@Injectable()
export class RestaurantTypeOrmRepository implements RestaurantRepository {
  constructor(
    @InjectRepository(Restaurant)
    private readonly repo: Repository<Restaurant>,
  ) {}

  findAll(): Promise<Restaurant[]> {
    return this.repo.find();
  }

  findById(id: string): Promise<Restaurant | null> {
    return this.repo.findOne({ where: { id } });
  }

  findByCategory(categoryName: string): Promise<Restaurant[]> {
    return this.repo
      .createQueryBuilder('r')
      .where(`JSON_CONTAINS(r.categories, :cat, '$')`, {
        cat: JSON.stringify({ name: categoryName }),
      })
      .getMany();
  }

  async findCategories(): Promise<CategoryDto[]> {
    const rows = await this.repo.find({ select: ['categories'] });
    const seen = new Set<string>();
    const out: CategoryDto[] = [];
    for (const r of rows) {
      for (const c of r.categories ?? []) {
        if (c?.name && !seen.has(c.name)) {
          seen.add(c.name);
          out.push({ name: c.name });
        }
      }
    }
    return out;
  }

  create(data: Omit<Restaurant, 'id'>): Promise<Restaurant> {
    const entity = this.repo.create({
      id: randomUUID(),
      ...data,
    });
    return this.repo.save(entity);
  }

  deleteAll(): Promise<DeleteResult> {
    return this.repo.deleteAll();
  }
}
