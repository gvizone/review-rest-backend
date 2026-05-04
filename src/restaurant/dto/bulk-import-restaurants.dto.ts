import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { CreateRestaurantDto } from './create-restaurant.dto';

/** One row from a JSON dump; `id` is optional (server generates if omitted). */
export class BulkRestaurantItemDto extends CreateRestaurantDto {
  @IsOptional()
  @IsUUID('4')
  id?: string;
}

export class BulkImportRestaurantsDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => BulkRestaurantItemDto)
  items: BulkRestaurantItemDto[];
}
