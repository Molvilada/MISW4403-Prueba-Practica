import { IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { INCORRECT_TYPE_MSG, PRODUCT_TYPES } from './constants';

export class ProductDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsNumber()
  @IsNotEmpty()
  readonly price: Number;

  @IsString()
  @IsNotEmpty()
  @IsIn(PRODUCT_TYPES, {
    message: INCORRECT_TYPE_MSG,
  })
  readonly type: string;
}
