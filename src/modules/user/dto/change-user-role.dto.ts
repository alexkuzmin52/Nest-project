import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserRoleEnum } from '../../../constants/user-role-enum';

export class ChangeUserRoleDto {
  @ApiProperty({ description: 'User role' })
  @IsNotEmpty()
  @IsEnum(UserRoleEnum)
  role: UserRoleEnum;
}
