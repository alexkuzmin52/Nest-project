import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

import { ApiPropertyOptional } from '@nestjs/swagger';
import { ProductTypeEnum } from '../../../constants';

export class ProductQueryFilterDto {
  @ApiPropertyOptional({
    description: 'Category name',
    minLength: 2,
    maxLength: 32,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Length(2, 32)
  category: string;

  @ApiPropertyOptional({
    description: 'Brand name',
    // example: 'Some_brand',
    minLength: 2,
    maxLength: 32,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Length(2, 32)
  brand: string;

  @ApiPropertyOptional({
    description: 'Country Of manufacture',
    minLength: 2,
    maxLength: 32,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Length(2, 32)
  countryOfManufacture: string;

  @ApiPropertyOptional({
    description: 'Provider name',
    minLength: 2,
    maxLength: 32,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Length(2, 32)
  provider: string;

  @ApiPropertyOptional({
    description: 'Type of product',
    enum: ProductTypeEnum,
    example: ProductTypeEnum.COUNTED,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(ProductTypeEnum)
  accountingType: ProductTypeEnum;

  @ApiPropertyOptional({
    description: 'Minimum number of products in stock',
    type: Number,
    minimum: 0,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  stockCountMin = 0;

  @ApiPropertyOptional({
    description: 'Maximum number of products in stock',
    type: Number,
    maximum: 1000000,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  stockCountMax = 1000000;

  @ApiPropertyOptional({
    description: 'Minimum number of products in store',
    type: Number,
    minimum: 0,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  storeCountMin = 0;

  @ApiPropertyOptional({
    description: 'Maximum number of products in store',
    type: Number,
    maximum: 1000000,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  storeCountMax = 1000000;

  @ApiPropertyOptional({
    description: 'Sign of new product',
    example: false,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  newFlag: boolean;

  @ApiPropertyOptional({
    description: 'Sign of discount',
    example: false,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  discountFlag: boolean;

  @ApiPropertyOptional({
    description: 'Sign of promo',
    example: false,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  promoFlag: boolean;

  @ApiPropertyOptional({
    type: String,
    description: 'Sorting field',
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
}
