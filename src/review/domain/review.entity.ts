import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Restaurant } from '../../restaurant/domain/restaurant.entity';
import { User } from '../../user/domain/user.entity';
import { ReviewNoteEmbeddable } from './review-note.embeddable';

@Entity('reviews')
export class Review {
  @PrimaryColumn('uuid')
  id: string;

  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Restaurant, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: Restaurant;

  @Column(() => ReviewNoteEmbeddable, { prefix: 'note_' })
  note: ReviewNoteEmbeddable;

  @Column({ type: 'text', nullable: true })
  commentary?: string;

  @Column({ type: 'json' })
  images: string[];
}
