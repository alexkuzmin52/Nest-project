import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserStatusEnum } from '../../../constants';

export class ChangeUserStatusDto {
  @ApiProperty({ description: 'User status' })
  @IsNotEmpty()
  @IsEnum(UserStatusEnum)
  status: UserStatusEnum;
}
