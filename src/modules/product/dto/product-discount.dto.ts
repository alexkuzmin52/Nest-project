import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class ProductDiscountDto {
  // @ApiProperty()
  // @IsNotEmpty()
  // @IsString()
  // @IsMongoId()
  // productId: string;

  @ApiProperty({ default: 0 })
  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  @Min(0)
  @Max(99)
  discount: number;
}
