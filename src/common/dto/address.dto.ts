import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { optionalStringFromJson } from '../utils/utils';

export class AddressDto {
  @IsString()
  @IsOptional()
  @Transform(({ value }: { value: unknown }) => optionalStringFromJson(value))
  street?: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  country: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }: { value: unknown }) => optionalStringFromJson(value))
  zipCode?: string;
}
