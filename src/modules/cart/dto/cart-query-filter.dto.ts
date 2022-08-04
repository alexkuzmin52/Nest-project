import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

import { CartStatusEnum } from '../../../constants';

export class CartQueryFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsMongoId()
  userId: string;

  @ApiPropertyOptional({ enum: CartStatusEnum })
  @IsOptional()
  @IsNotEmpty()
  status: CartStatusEnum;
  @ApiPropertyOptional({
    type: Number,
    description: 'Limit records per page',
    default: 10,
  })
  @IsOptional()
  @IsNotEmpty()
  @Type(() => Number)
  limit: number;

  @ApiPropertyOptional({
    type: Number,
    description: 'Number of pages',
    default: 1,
  })
  @IsOptional()
  @IsNotEmpty()
  @Type(() => Number)
  page: number;

  @ApiPropertyOptional({
    type: String,
    description: 'Sorting field',
    enum: CartStatusEnum,
  })
  @IsOptional()
  @IsNotEmpty()
  sortingField: string;

  @ApiPropertyOptional({
    type: Number,
    description: 'Sorting direction',
    enum: [1, -1],
    default: 1,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsEnum([1, -1])
  @Type(() => Number)
  sortingDirection: number;
}
