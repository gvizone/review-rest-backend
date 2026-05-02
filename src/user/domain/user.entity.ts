import { Column, Entity, PrimaryColumn } from 'typeorm';
import { AddressEmbeddable } from '../../common/domain/address.embeddable';

@Entity('users')
export class User {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column(() => AddressEmbeddable, { prefix: 'address_' })
  address: AddressEmbeddable;
}
