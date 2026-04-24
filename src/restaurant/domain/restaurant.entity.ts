import { Column, Entity, PrimaryColumn } from 'typeorm';
import { AddressEmbeddable } from '../../common/domain/address.embeddable';
import type { CategoryDto } from '../../common/dto/category.dto';

@Entity('restaurants')
export class Restaurant {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column(() => AddressEmbeddable, { prefix: 'address_' })
  address: AddressEmbeddable;

  @Column({ type: 'json' })
  categories: CategoryDto[];

  @Column({ nullable: true })
  instagram?: string;

  @Column({ type: 'json', nullable: true })
  images?: string[];
}
