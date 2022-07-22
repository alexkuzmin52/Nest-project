import { ApiProperty } from '@nestjs/swagger';
import { Document, SchemaTypes } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { ISubCategory } from '../dto';

export type SubCategoryType = ISubCategory & Document;

@Schema({ timestamps: true })
export class SubCategory {
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

  // @ApiProperty({
  //   description: 'Array of children subcategories',
  //   example: [],
  // })
  // @Prop({ type: Array, default: [] })
  // subcategory: [];
  //
  @ApiProperty({ description: 'Logo of subcategory', example: 'fileName' })
  @Prop({ default: null })
  logo: string;
}
export const SubCategorySchema = SchemaFactory.createForClass(SubCategory);
