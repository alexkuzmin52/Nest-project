import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CartProductDto {
  @ApiProperty({ description: 'Add product Id' })
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  productId: string;
}
