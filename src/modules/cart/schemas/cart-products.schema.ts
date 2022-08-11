import * as mongoose from 'mongoose';
import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { ApiProperty } from '@nestjs/swagger';
import { ICartProduct } from '../dto';
import { Product } from '../../product/schemas/product-schema';

export type CartProductsType = ICartProduct & Document;

@Schema({ _id: false })
export class CartProducts {
  @ApiProperty({ type: String })
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: Product.name,
    default: null,
  })
  productId: string | Types.ObjectId | Product;

  @ApiProperty({ default: 0 })
  @Prop({ required: true, type: Number, default: 0 })
  price: number;

  @ApiProperty({ default: 1 })
  @Prop({ required: true, type: Number, default: 1 })
  count: number;

  @ApiProperty({ default: 0 })
  @Prop({ required: true, type: Number, default: 0 })
  cost: number;
}

export const cartProductsSchema = SchemaFactory.createForClass(CartProducts);
