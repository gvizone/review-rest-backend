import { Column } from 'typeorm';

export class ReviewNoteEmbeddable {
  @Column({ type: 'tinyint', unsigned: true })
  service: number;

  @Column({ type: 'tinyint', unsigned: true })
  food: number;

  @Column({ type: 'tinyint', unsigned: true })
  value: number;

  @Column({ type: 'tinyint', unsigned: true })
  atmosphere: number;
}
