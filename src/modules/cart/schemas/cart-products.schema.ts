import * as mongoose from 'mongoose';
import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { ICartProduct } from '../dto';
import { User } from '../../user/schemas/user-schema';

export type CartProductsType = ICartProduct & Document;

@Schema({ _id: false })
export class CartProducts {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    default: null,
  })
  productId: string | Types.ObjectId;

  @Prop({ required: true, type: Number, default: 0 })
  price: number;

  @Prop({ required: true, type: Number, default: 0 })
  count: number;

  @Prop({ required: true, type: Number, default: 0 })
  cost: number;
}

export const cartProductsSchema = SchemaFactory.createForClass(CartProducts);
