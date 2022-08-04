import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsMongoId, IsNotEmpty } from 'class-validator';

export class ChangeCountProductDto {
  @ApiProperty({ required: true, description: 'ProductId' })
  @IsNotEmpty()
  @IsMongoId()
  productId: string;

  @ApiProperty({ required: true, description: 'Count of products' })
  @IsNotEmpty()
  @IsInt()
  count: number;
}
