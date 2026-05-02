import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { ReviewNoteDto } from './review-note.dto';

export class CreateReviewDto {
  @IsUUID('4')
  userId: string;

  @IsUUID('4')
  restaurantId: string;

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
