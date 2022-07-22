import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductTypeEnum } from '../../../constants';
import { Type } from 'class-transformer';

export class ProductFilterDto {
  @ApiPropertyOptional({
    description: 'Category name',
    example: 'Some_category',
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
    example: 'Some_brand',
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
    example: 'Ukraine',
    minLength: 2,
    maxLength: 32,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Length(2, 32)
  countryOfManufacture: string;

  @ApiProperty({
    description: 'Provider name',
    example: 'Some_provider',
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
    description: 'Number of products in stock',
    example: 100,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(1000000)
  @Type(() => Number)
  stockCount: object = { $gte: Number, $lte: Number };

  @ApiPropertyOptional({
    description: 'Number of products in store',
    example: 100,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(1000000)
  @Type(() => Number)
  storeCount: object = { $gte: Number, $lte: Number };

  @ApiPropertyOptional({
    description: 'New Product',
    example: false,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  newFlag: boolean;

  @ApiPropertyOptional({
    description: 'New Product',
    example: false,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  discountFlag: boolean;

  @ApiPropertyOptional({
    description: 'New Product',
    example: false,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  promoFlag: boolean;
}
