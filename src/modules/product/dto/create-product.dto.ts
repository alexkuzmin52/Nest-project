import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  Length,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ItemDimensionsDto } from './item-dimensions.dto';
import { PackageDimensionsDto } from './package-dimensions.dto';
import { ProductTypeEnum } from '../../../constants';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product name',
    example: 'Some_product',
    minLength: 2,
    maxLength: 32,
  })
  @IsNotEmpty()
  @IsString()
  @Length(2, 32)
  title: string;

  @ApiProperty({
    description: 'Category name',
    example: 'Some_category',
    minLength: 2,
    maxLength: 32,
  })
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
  @IsNotEmpty()
  @IsString()
  @Length(2, 32)
  provider: string;

  @ApiProperty({
    description: 'Type of product',
    enum: ProductTypeEnum,
    example: ProductTypeEnum.COUNTED,
  })
  @IsNotEmpty()
  @IsEnum(ProductTypeEnum)
  accountingType: ProductTypeEnum;

  @ApiProperty({
    description: 'Original price',
    example: '60.00',
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Min(0.01)
  originalPrice: number;

  @ApiProperty({
    description: 'Number of products in stock',
    example: 100,
  })
  @IsNotEmpty()
  @IsNumber()
  stockCount: number;

  @ApiProperty({
    description: 'Number of products in store',
    example: 100,
  })
  @IsNotEmpty()
  @IsNumber()
  storeCount: number;

  @ApiProperty({
    description: 'Short description of product',
    minLength: 3,
    maxLength: 128,
    example: 'Short description of this product',
  })
  @IsNotEmpty()
  @IsString()
  @Length(2, 128)
  shortDescription: string;

  @ApiProperty({
    description: 'Full description of product',
    minLength: 2,
    maxLength: 2048,
    example: 'Full description of this product',
  })
  @IsNotEmpty()
  @IsString()
  @Length(2, 2048)
  fullDescription: string;

  @ApiProperty({
    description: 'Short characteristics of product',
    minLength: 3,
    maxLength: 256,
    example: 'Short characteristics of this product',
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 256)
  shortCharacteristics: string;

  @ApiProperty({
    description: 'Full characteristics of product',
    minLength: 3,
    maxLength: 2048,
    example: 'Short characteristics of this product',
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 2048)
  fullCharacteristics: string;

  @ApiPropertyOptional({
    description: 'Page of this product',
    example: 'https://somepage.com/',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsUrl()
  overview_url: string;

  @ApiPropertyOptional({
    description: 'New Product',
    example: false,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  newFlag: boolean;

  @ApiPropertyOptional({ description: 'Unit kit', default: null })
  @IsOptional()
  @IsString()
  @Length(3, 128)
  equipment: string;

  @ApiPropertyOptional({ description: 'Number of kits per pack', default: 1 })
  @IsOptional()
  @IsInt()
  @IsPositive()
  packageAmount: number;

  @ApiPropertyOptional({
    type: Object,
    description: 'Item dimensions',
    example: { length: 1250, width: 800, height: 400, weight: 22.55 },
  })
  @IsObject()
  itemDimensions: ItemDimensionsDto;

  @ApiPropertyOptional({
    type: Object,
    description: 'Package dimensions',
    example: { length: 1500, width: 1000, height: 60000, weight: 45.01 },
  })
  @IsObject()
  packageDimensions: PackageDimensionsDto;
}
