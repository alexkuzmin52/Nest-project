import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { AffiliationEnum } from '../../../constants/affiliation.enum';
import { IFile } from '../dto/file.interface';
import { MimeTypesEnum } from '../../../constants/mime-type.enum';

export type PhotoType = IFile & Document;

@Schema({ timestamps: true })
export class Photo {
  @ApiProperty({
    description: 'Image or Video',
    type: String,
    enum: MimeTypesEnum,
  })
  @Prop({ required: true })
  mime: string;

  @ApiProperty({ description: 'Belonging to object' })
  @Prop({ required: true, type: String, enum: AffiliationEnum })
  affiliation: string;

  @ApiPropertyOptional({ description: 'Object ID', default: '' })
  @Prop({ required: false })
  ownerId: string;

  @ApiPropertyOptional({ description: 'Array of filenames', default: null })
  @Prop({ required: false })
  files: [string] = null;

  @ApiPropertyOptional({ description: 'Filename', default: '' })
  @Prop({ required: false })
  file: string;
}

export const photoSchema = SchemaFactory.createForClass(Photo);
