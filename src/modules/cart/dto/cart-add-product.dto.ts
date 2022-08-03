import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional } from 'class-validator';

import { CartProductDto } from './cart-product.dto';
import { CartStatusEnum } from '../../../constants';

export class AddProductToCartDto {
  @ApiProperty({ description: 'Products set', type: [CartProductDto] })
  @IsOptional()
  @IsArray()
  products: CartProductDto[];

  @ApiPropertyOptional({ description: 'Products amount', type: Number })
  @IsOptional()
  @IsNumber()
  amount: number;

  @ApiPropertyOptional({ description: 'Total cost', type: Number })
  @IsOptional()
  @IsNumber()
  totalCost: number;

  @ApiPropertyOptional({ description: 'Status', enum: CartStatusEnum })
  @IsOptional()
  status: CartStatusEnum;
}
