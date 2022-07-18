import { Document } from 'mongoose';
import { IProduct } from '../dto/product.interface';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type ProductType = IProduct & Document;

@Schema()
export class Product {
  @ApiProperty({
    description: 'Product name',
    example: 'Some product',
    minLength: 2,
    maxLength: 32,
  })
  @Prop({ required: true, unique: true })
  title: string;

  @ApiProperty({
    description: 'Category name',
    example: 'Some category',
    minLength: 2,
    maxLength: 32,
  })
  @Prop({ required: true })
  category: string;

  @ApiProperty({
    description: 'Brand name',
    example: 'Some brand',
    minLength: 2,
    maxLength: 32,
  })
  @Prop({ required: true })
  brand: string;

  @ApiProperty({
    description: 'Price',
    example: '50.22',
  })
  @Prop({ required: true })
  price: number;
}

export const productSchema = SchemaFactory.createForClass(Product);
