import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { ActionEnum } from '../../../constants';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLogDto {
  @ApiProperty({ enum: ActionEnum })
  @IsNotEmpty()
  @IsEnum(ActionEnum)
  event: ActionEnum;

  @IsNotEmpty()
  userID: string;

  @IsOptional()
  data?: any;
}
