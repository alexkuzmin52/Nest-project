import * as mongoose from 'mongoose';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { ActionEnum } from '../../../constants';
import { ILog } from '../dto';
import { User } from '../../user/schemas/user-schema';

export type LogType = ILog & mongoose.Document;
@Schema({ timestamps: true })
export class Log {
  @ApiPropertyOptional({ enum: ActionEnum })
  @Prop({ required: true, enum: ActionEnum })
  event: string;

  @ApiPropertyOptional({ type: mongoose.Schema.Types.ObjectId })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: string;

  @ApiPropertyOptional()
  @Prop({ type: mongoose.Schema.Types.Mixed, default: null })
  data: any;
}
export const logSchema = SchemaFactory.createForClass(Log);
