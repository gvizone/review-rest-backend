import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { AddressDto } from '../../common/dto/address.dto';
import { CategoryDto } from '../../common/dto/category.dto';

function optionalUrlStringFromJson(value: unknown): string | undefined {
  if (value === null || value === '') {
    return undefined;
  }
  if (typeof value === 'string') {
    return value;
  }
  return undefined;
}

function stringArrayFromJson(value: unknown): string[] | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }
  if (!Array.isArray(value)) {
    return undefined;
  }
  if (!value.every((item): item is string => typeof item === 'string')) {
    return undefined;
  }
  return value;
}

export class CreateRestaurantDto {
  @IsString()
  name: string;

  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @ValidateNested()
  @Type(() => CategoryDto)
  categories: CategoryDto[];

  @IsUrl()
  @IsOptional()
  @Transform(({ value }: { value: unknown }) =>
    optionalUrlStringFromJson(value),
  )
  instagram?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) => stringArrayFromJson(value))
  images?: string[];
}
