import { IsNotEmpty, IsNumber, IsString, Matches } from 'class-validator';
import { INCORRECT_CITY_MSG } from './constants';

export class StoreDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z]{3}$/, {
    message: INCORRECT_CITY_MSG,
  })
  readonly city: Number;

  @IsString()
  @IsNotEmpty()
  readonly address: string;
}
