import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../user/schemas/user-schema';
import { ILog } from '../dto';

export type LogType = ILog & mongoose.Document;
@Schema({ timestamps: true })
export class Log {
  @Prop({ required: true })
  event: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: User;
  @Prop({ type: mongoose.Schema.Types.Mixed, default: null })
  data: any;
}
export const logSchema = SchemaFactory.createForClass(Log);
