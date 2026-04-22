import { Type } from 'class-transformer';
import { IsEmail, IsString, ValidateNested } from 'class-validator';
import { AddressDto } from '../../common/dto/address.dto';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;
}
