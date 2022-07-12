import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { ICategory } from '../dto/category.interface';
import { Document, SchemaTypes } from 'mongoose';

export type CategoryType = ICategory & Document;

@Schema({ timestamps: true })
export class Category {
  @ApiProperty({ description: 'Reserve', example: null })
  @Prop({ type: String, default: null })
  code: '';

  @ApiProperty({
    description: 'Category name',
    example: 'Some category',
    minLength: 2,
    maxLength: 32,
  })
  @Prop({ required: true, unique: true })
  title: string;

  @ApiProperty({ description: 'ParentId', example: null })
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: '#',
    default: null,
  })
  parentId: string;

  @ApiProperty({
    description: 'Link to view page',
    example: 'https://www.google.com',
  })
  @Prop()
  url: string;

  @ApiProperty({
    description: 'Array of children subcategories',
    example: [],
  })
  @Prop({ type: Array, default: [] })
  subcategory: [];

  @ApiProperty({ description: 'Logo of category', example: 'fileName' })
  @Prop({ default: null })
  logo: string;
}
export const CategorySchema = SchemaFactory.createForClass(Category);
