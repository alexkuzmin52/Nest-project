import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { UserRoleEnum } from '../constants/user-role-enum';

export class ChangeUserPasswordDto {
  @ApiProperty({
    type: String,
    minimum: 6,
    description: 'Password',
    example: 'pAsSwOrd',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}
