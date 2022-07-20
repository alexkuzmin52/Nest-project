import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { IProduct } from '../dto';
import { ProductTypeEnum } from '../../../constants/product-type-enum';

export type ProductType = IProduct & Document;

@Schema({ timestamps: true })
export class Product {
  @ApiProperty({
    description: 'Product name',
    minLength: 2,
    maxLength: 32,
  })
  @Prop({ required: true, unique: true })
  title: string;

  @ApiProperty({
    description: 'Category name',
    minLength: 2,
    maxLength: 32,
  })
  @Prop({ required: true })
  category: string;

  @ApiProperty({
    description: 'Brand name',
    minLength: 2,
    maxLength: 32,
    default: null,
  })
  @Prop({ required: false, default: null })
  brand: string;

  @ApiProperty({
    description: 'Country of manufacture',
    minLength: 2,
    maxLength: 32,
    default: 'Ukraine',
  })
  @Prop({ required: false, default: 'Ukraine' })
  countryOfManufacture: string;

  @ApiProperty({
    description: 'Category name',
    minLength: 2,
    maxLength: 32,
  })
  @Prop({ required: true })
  provider: string;

  @ApiProperty({
    description: 'Product type',
    enum: ProductTypeEnum,
    enumName: 'ProductTypeEnum',
  })
  @Prop({
    required: true,
    enum: ProductTypeEnum,
    default: ProductTypeEnum.COUNTED,
  })
  accountingType: ProductTypeEnum;

  @ApiProperty({
    description: 'Original price',
  })
  @Prop({ required: true })
  originalPrice: number;

  @ApiPropertyOptional({
    description: 'Sign of discount',
    default: 0,
  })
  @Prop({ required: false, default: 0 })
  discount: number;

  @ApiPropertyOptional({
    description: 'Sign of promotions',
  })
  @Prop({ required: false, default: false })
  promoFlag: boolean;

  @ApiPropertyOptional({
    description: 'Sign of discount',
  })
  @Prop({ required: false, default: false })
  discountFlag: boolean;

  @ApiProperty({
    description: 'Price',
  })
  @Prop({ required: true })
  price: number;

  @ApiProperty({
    description: 'Number of products in stock',
  })
  @Prop({ required: true, default: 0 })
  stockCount: number;

  @ApiProperty({
    description: 'Number of products in store',
  })
  @Prop({ required: true, default: 0 })
  storeCount: number;

  @ApiProperty({
    description: 'Short description of product',
    minLength: 3,
    maxLength: 128,
  })
  @Prop({ required: true })
  shortDescription: string;

  @ApiProperty({
    description: 'Short description of product',
    minLength: 3,
    maxLength: 2048,
  })
  @Prop({ required: true })
  fullDescription: string;

  @ApiProperty({
    description: 'Short characteristics of product',
    minLength: 3,
    maxLength: 256,
  })
  @Prop({ required: true })
  shortCharacteristics: string;

  @ApiProperty({
    description: 'Full characteristics of product',
    minLength: 3,
    maxLength: 2048,
  })
  @Prop({ required: true })
  fullCharacteristics: string;

  @ApiPropertyOptional({
    description: 'Page of this product',
    example: 'http://localhost:3000/doc/',
  })
  @Prop({ required: false })
  overview_url: string;

  @ApiPropertyOptional({
    description: 'Array of photo names',
  })
  @Prop({ required: false })
  photos: [string];

  @ApiPropertyOptional({
    description: 'Sign of a new product',
  })
  @Prop({ required: false, default: false })
  newFlag: boolean;

  @ApiPropertyOptional({
    description: 'Unit of kit',
  })
  @Prop({ required: false, default: null })
  equipment: string;

  @ApiPropertyOptional({
    description: 'Number of kits per pack',
    default: 1,
  })
  @Prop({ required: false, default: 1 })
  packageAmount: number;

  @ApiPropertyOptional({
    type: Object,
    description: 'ItemDimensions',
  })
  @Prop({ type: Object, default: {} })
  itemDimensions: object;

  @ApiPropertyOptional({
    type: Object,
    description: 'Package dimensions',
  })
  @Prop({ type: Object, default: {} })
  packageDimensions: object;
}

export const productSchema = SchemaFactory.createForClass(Product);
