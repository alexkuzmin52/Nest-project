import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { ActionEnum } from '../../../constants';

export class LogFilterDto {
  @ApiPropertyOptional({ description: 'Event', enum: ActionEnum })
  @IsOptional()
  @IsString()
  @IsEnum(ActionEnum)
  event: string;

  @ApiPropertyOptional({ description: 'User Id' })
  @IsOptional()
  userId: string;
}
