import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { CreateRestaurantDto } from '../../restaurant/dto/create-restaurant.dto';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { ReviewNoteDto } from './review-note.dto';

export class CreateReviewDto {
  @ValidateNested()
  @Type(() => CreateUserDto)
  user: CreateUserDto;

  @ValidateNested()
  @Type(() => CreateRestaurantDto)
  restaurant: CreateRestaurantDto;

  @ValidateNested()
  @Type(() => ReviewNoteDto)
  note: ReviewNoteDto;

  @IsString()
  @IsOptional()
  commentary?: string;

  @IsArray()
  @IsString({ each: true })
  images: string[];
}
