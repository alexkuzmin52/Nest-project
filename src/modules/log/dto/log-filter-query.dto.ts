import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

import { ActionEnum } from '../../../constants';

export class LogFilterQueryDto {
  @ApiPropertyOptional({ description: 'Event', enum: ActionEnum })
  @IsOptional()
  @IsString()
  @IsEnum(ActionEnum)
  event: string;

  @ApiPropertyOptional({ description: 'User Id' })
  @IsOptional()
  userId: string;

  @ApiPropertyOptional({
    description: 'Start date',
    type: 'string',
    format: 'date-time',
    default: '2022-01-01',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  createdAtMin: Date;

  @ApiPropertyOptional({
    description: 'Finish date',
    type: 'string',
    format: 'date-time',
    default: '2022-07-25',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  createdAtMax: Date;

  @ApiPropertyOptional({
    type: String,
    description: 'Sorting field',
  })
  @IsOptional()
  @IsNotEmpty()
  sortingField: string;

  @ApiPropertyOptional({
    type: Number,
    description: 'Sorting direction',
    enum: [1, -1],
    default: 1,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsEnum([1, -1])
  @Type(() => Number)
  sortingDirection: number;

  @ApiPropertyOptional({
    type: Number,
    description: 'Limit records per page',
    default: 10,
  })
  @IsOptional()
  @IsNotEmpty()
  @Type(() => Number)
  limit: number;

  @ApiPropertyOptional({
    type: Number,
    description: 'Number of pages',
    default: 1,
  })
  @IsOptional()
  @IsNotEmpty()
  @Type(() => Number)
  page: number;
}
