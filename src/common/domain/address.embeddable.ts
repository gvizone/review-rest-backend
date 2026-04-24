import { Column } from 'typeorm';

/** Columns are embedded into parent entity tables via `@Column(() => AddressEmbeddable, { prefix })`. */
export class AddressEmbeddable {
  @Column({ nullable: true })
  street?: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  country: string;

  @Column({ name: 'zip_code', nullable: true })
  zipCode?: string;
}
