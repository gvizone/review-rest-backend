import { Type } from 'class-transformer';
import {
  IsArray,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { AddressDto } from '../../common/dto/address.dto';

export class CreateRestaurantDto {
  @IsString()
  name: string;

  @ValidateNested()
  @IsObject()
  @Type(() => AddressDto)
  address: AddressDto;

  @IsObject()
  categories: Record<string, string>;

  @IsUrl()
  @IsOptional()
  instagram?: string;

  @IsArray()
  @IsString({ each: true })
  images: string[];
}
