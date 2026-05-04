import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { CategoryDto } from '../../common/dto/category.dto';
import {
  optionalStringFromJson,
  stringArrayFromJson,
} from 'src/common/utils/utils';

/** Partial address fields merged into the existing row. */
export class UpdateAddressDto {
  @IsString()
  @IsOptional()
  street?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  zipCode?: string;
}

/** Partial update — only fields present in the body are applied. */
export class UpdateRestaurantDto {
  @IsString()
  @IsOptional()
  @MaxLength(500)
  name?: string;

  @ValidateNested()
  @Type(() => UpdateAddressDto)
  @IsOptional()
  address?: UpdateAddressDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CategoryDto)
  @IsOptional()
  categories?: CategoryDto[];

  @IsUrl()
  @IsOptional()
  @Transform(({ value }: { value: unknown }) => optionalStringFromJson(value))
  instagram?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) => stringArrayFromJson(value))
  images?: string[];

  /** Omit to leave unchanged; send `""` to clear. */
  @IsString()
  @IsOptional()
  @MaxLength(20000)
  about?: string;
}
