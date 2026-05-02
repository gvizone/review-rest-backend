import { IsOptional, IsString } from 'class-validator';

export class UpdateProfileImageDto {
  /** Data URL or base64; send empty string to remove the photo. */
  @IsOptional()
  @IsString()
  image?: string;
}
