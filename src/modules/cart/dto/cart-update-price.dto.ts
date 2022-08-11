import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsPositive } from 'class-validator';

// TODO delete
export class CartUpdatePriceDto {
  @ApiProperty()
  @IsMongoId()
  productId: string;

  @ApiProperty()
  @IsPositive()
  price: number;
}
