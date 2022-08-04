import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

import { CartStatusEnum } from '../../../constants';
export class CartFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsMongoId()
  userId: string;

  @ApiPropertyOptional({ enum: CartStatusEnum })
  @IsOptional()
  @IsNotEmpty()
  status: CartStatusEnum;
}
