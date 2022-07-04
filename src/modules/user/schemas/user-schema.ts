import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { IUser } from '../dto/user.interface';
import { UserRoleEnum } from '../../../constants/user-role-enum';
import { UserStatusEnum } from '../../../constants/user-status-enum';
import { UserGenderEnum } from '../../../constants/user-gender-enum';

export type UserType = IUser & Document;

@Schema({ timestamps: true })
export class User {
  @ApiProperty({ description: 'Username', example: 'Alex' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ example: 'Kuzmin', description: 'User surname' })
  @Prop({ required: true })
  surname: string;

  @ApiProperty({ example: 'alex@some.com', description: 'Email' })
  @Prop({ required: true, unique: true })
  email: string;

  @ApiProperty({ example: 'passWOrd123', description: 'password' })
  @Prop({ required: true, select: false })
  password: string;

  @ApiPropertyOptional({
    // example: 'user' || null,
    enum: UserRoleEnum,
    description: 'Role',
  })
  @Prop({ required: true, default: UserRoleEnum.USER })
  role: string;

  @ApiPropertyOptional({ example: 33, description: 'Age' })
  @Prop({ default: null })
  age: number;

  @ApiProperty({ example: '0663334455', description: 'Phone' })
  @Prop({ required: true })
  phone: string;

  @ApiPropertyOptional({
    example: 'user',
    description: 'Status',
    enum: UserStatusEnum,
  })
  @Prop({ default: UserStatusEnum.PENDING })
  status: string;

  @ApiPropertyOptional({
    example: 'male',
    description: 'Gender',
    enum: UserGenderEnum,
  })
  @Prop({ default: null })
  gender: string;

  @ApiPropertyOptional({
    example: 'https://www.some.com/someimage.ipg',
    description: 'Image link',
  })
  @Prop({ default: null })
  photo: string;

  @ApiPropertyOptional({ example: 'token', description: 'Token' })
  @Prop({ default: null })
  token: string;
}

export const userSchema = SchemaFactory.createForClass(User);
