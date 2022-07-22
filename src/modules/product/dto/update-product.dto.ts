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
import { ProductTypeEnum } from '../../../constants/product-type-enum';

export class UpdateProductDto {
  @ApiPropertyOptional({
    description: 'Product name',
    example: 'Some_product',
    minLength: 2,
    maxLength: 32,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Length(2, 32)
  title: string;

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
    description: 'Original price',
    example: '60.00',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Min(0.01)
  originalPrice: number;

  @ApiPropertyOptional({
    description: 'Number of products in stock',
    example: 100,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  stockCount: number;

  @ApiPropertyOptional({
    description: 'Number of products in store',
    example: 100,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  storeCount: number;

  @ApiPropertyOptional({
    description: 'Short description of product',
    minLength: 3,
    maxLength: 128,
    example: 'Short description of this product',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Length(2, 128)
  shortDescription: string;

  @ApiPropertyOptional({
    description: 'Full description of product',
    minLength: 2,
    maxLength: 2048,
    example: 'Full description of this product',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Length(2, 2048)
  fullDescription: string;

  @ApiPropertyOptional({
    description: 'Short characteristics of product',
    minLength: 3,
    maxLength: 256,
    example: 'Short characteristics of this product',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Length(3, 256)
  shortCharacteristics: string;

  @ApiPropertyOptional({
    description: 'Full characteristics of product',
    minLength: 3,
    maxLength: 2048,
    example: 'Short characteristics of this product',
  })
  @IsOptional()
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
  @IsOptional()
  @IsObject()
  itemDimensions: ItemDimensionsDto;

  @ApiPropertyOptional({
    type: Object,
    description: 'Package dimensions',
    example: { length: 1500, width: 1000, height: 60000, weight: 45.01 },
  })
  @IsOptional()
  @IsObject()
  packageDimensions: PackageDimensionsDto;
}
