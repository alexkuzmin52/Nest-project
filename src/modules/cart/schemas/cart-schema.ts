import * as mongoose from 'mongoose';
import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { CartProducts, cartProductsSchema } from './cart-products.schema';
import { CartStatusEnum } from '../../../constants';
import { ICart } from '../dto';
import { User, UserType } from '../../user/schemas/user-schema';

export type CartType = ICart & Document;

@Schema({ timestamps: true })
export class Cart {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  userId: string | Types.ObjectId | UserType;

  @Prop({ required: true, type: [cartProductsSchema], default: [] })
  products: CartProducts[];

  @Prop({ required: true, type: Number, default: 0 })
  amount: number;

  @Prop({ required: true, type: Number, default: 0 })
  totalCost: number;

  @Prop({ required: true, enum: CartStatusEnum, default: CartStatusEnum.EMPTY })
  status: CartStatusEnum;
}
export const cartSchema = SchemaFactory.createForClass(Cart);
