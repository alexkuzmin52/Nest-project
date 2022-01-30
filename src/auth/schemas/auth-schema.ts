import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { IAuth } from '../dto/auth.interface';
import { User } from '../../user/schemas/user-schema';

export type AuthType = IAuth & Document;

@Schema({ timestamps: true })
export class Auth {
  @Prop({ required: true })
  access_token: string;

  @Prop({ required: false })
  refresh_token: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  userID: User;
}
export const authSchema = SchemaFactory.createForClass(Auth);
