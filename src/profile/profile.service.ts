import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { DecodedIdToken } from 'firebase-admin/auth';
import { Restaurant } from '../restaurant/domain/restaurant.entity';
import { Review } from '../review/domain/review.entity';
import { ReviewService } from '../review/review.service';
import { User } from '../user/domain/user.entity';
import { UserService } from '../user/user.service';
import { UpdateProfileImageDto } from './dto/update-profile-image.dto';

/** Aggregated profile payload for the authenticated account (API contract). */
export interface UserProfileSnapshot {
  user: User;
  reviews: Review[];
  visitedRestaurants: Restaurant[];
}

@Injectable()
export class ProfileService {
  constructor(
    private readonly userService: UserService,
    private readonly reviewService: ReviewService,
  ) {}

  async getProfileForFirebaseUser(
    firebaseUser: DecodedIdToken,
  ): Promise<UserProfileSnapshot> {
    const email = firebaseUser.email;
    if (!email) {
      throw new BadRequestException('Firebase account has no email');
    }
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException(
        'No profile found for this account. Complete registration first.',
      );
    }
    const reviews = await this.reviewService.findByUserId(user.id);
    return {
      user,
      reviews,
      visitedRestaurants: this.uniqueRestaurantsFromReviews(reviews),
    };
  }

  async updateProfileImage(
    firebaseUser: DecodedIdToken,
    dto: UpdateProfileImageDto,
  ): Promise<User> {
    const email = firebaseUser.email;
    if (!email) {
      throw new BadRequestException('Firebase account has no email');
    }
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException(
        'No profile found for this account. Complete registration first.',
      );
    }
    if (dto.image === undefined) {
      return user;
    }
    const nextImage = dto.image === '' ? null : dto.image;
    return this.userService.updateImage(user.id, nextImage);
  }

  private uniqueRestaurantsFromReviews(reviews: Review[]): Restaurant[] {
    const seen = new Set<string>();
    const result: Restaurant[] = [];
    for (const review of reviews) {
      const id = review.restaurant.id;
      if (!seen.has(id)) {
        seen.add(id);
        result.push(review.restaurant);
      }
    }
    return result;
  }
}
