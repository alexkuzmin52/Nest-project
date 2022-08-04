import * as mongoose from 'mongoose';
import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { CartProducts, cartProductsSchema } from './cart-products.schema';
import { CartStatusEnum } from '../../../constants';
import { ICart } from '../dto';
import { User, UserType } from '../../user/schemas/user-schema';
import { ApiProperty } from '@nestjs/swagger';

export type CartType = ICart & Document;

@Schema({ timestamps: true })
export class Cart {
  @ApiProperty({ type: String })
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  userId: string | Types.ObjectId | UserType;

  @ApiProperty({ type: [cartProductsSchema], default: [] })
  @Prop({ required: true, type: [cartProductsSchema], default: [] })
  products: CartProducts[];

  @ApiProperty({ default: 0 })
  @Prop({ required: true, type: Number, default: 0 })
  amount: number;

  @ApiProperty({ default: 0 })
  @Prop({ required: true, type: Number, default: 0 })
  totalCost: number;

  @ApiProperty({ enum: CartStatusEnum, default: CartStatusEnum.EMPTY })
  @Prop({ required: true, enum: CartStatusEnum, default: CartStatusEnum.EMPTY })
  status: CartStatusEnum;
}
export const cartSchema = SchemaFactory.createForClass(Cart);
