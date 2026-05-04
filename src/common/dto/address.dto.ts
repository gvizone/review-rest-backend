import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

/** JSON often sends `null`; normalize so class-validator optional fields behave. */
function optionalStringFromJson(value: unknown): string | undefined {
  if (value === null || value === '') {
    return undefined;
  }
  if (typeof value === 'string') {
    return value;
  }
  return undefined;
}

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
