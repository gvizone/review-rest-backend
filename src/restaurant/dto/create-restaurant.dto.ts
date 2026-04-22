import { Type } from 'class-transformer';
import {
  IsArray,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { AddressDto } from '../../common/dto/address.dto';
import { CategoryDto } from 'src/common/dto/category.dto';

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
  instagram?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];
}
