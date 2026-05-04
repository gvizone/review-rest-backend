import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Brackets, DeleteResult, Repository } from 'typeorm';
import { CategoryDto } from '../../common/dto/category.dto';
import { Restaurant } from '../domain/restaurant.entity';
import {
  RestaurantRepository,
  RestaurantSearchPage,
} from '../domain/restaurant.repository';

@Injectable()
export class RestaurantTypeOrmRepository implements RestaurantRepository {
  constructor(
    @InjectRepository(Restaurant)
    private readonly repo: Repository<Restaurant>,
  ) {}

  findAll(): Promise<Restaurant[]> {
    return this.repo.find();
  }

  async searchPaginated(
    qRaw: string,
    page: number,
    limit: number,
  ): Promise<RestaurantSearchPage> {
    const term = (qRaw ?? '').trim();
    const safe = term.replace(/[%_\\]/g, '').slice(0, 200);
    const buildQb = () => {
      const qb = this.repo.createQueryBuilder('r');
      if (safe.length > 0) {
        const like = `%${safe.toLowerCase()}%`;
        qb.where(
          new Brackets((w) => {
            // Use real DB column names (snake_case). Embedded `address` with prefix `address_`
            // maps to `address_city`, `address_state`, `address_country`, etc.
            w.where('LOWER(r.name) LIKE :like', { like })
              .orWhere('LOWER(r.address_city) LIKE :like', { like })
              .orWhere('LOWER(r.address_state) LIKE :like', { like })
              .orWhere('LOWER(r.address_country) LIKE :like', { like })
              .orWhere('LOWER(CAST(r.categories AS CHAR)) LIKE :like', {
                like,
              });
          }),
        );
      }
      return qb;
    };

    const total = await buildQb().getCount();
    const items = await buildQb()
      .orderBy('r.name', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    const hasMore = page * limit < total;
    return { items, total, page, limit, hasMore };
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

  create(data: Omit<Restaurant, 'id'> & { id?: string }): Promise<Restaurant> {
    const { id: requestedId, ...payload } = data;
    const id =
      typeof requestedId === 'string' && requestedId.trim().length > 0
        ? requestedId.trim()
        : randomUUID();
    const entity = this.repo.create({
      id,
      ...(payload as Omit<Restaurant, 'id'>),
    });
    return this.repo.save(entity);
  }

  deleteAll(): Promise<DeleteResult> {
    return this.repo.deleteAll();
  }
}
