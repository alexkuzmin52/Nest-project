import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

import { UserGenderEnum } from '../constants/user-gender-enum';
import { UserRoleEnum } from '../constants/user-role-enum';
import { UserStatusEnum } from '../constants/user-status-enum';
import { Type } from 'class-transformer';

export class UserFilterDto {
  @ApiProperty({
    type: String,
    minimum: 2,
    maximum: 20,
    description: 'Username',
    example: 'Alex',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Length(2, 20)
  name: string;

  @ApiProperty({
    type: String,
    minimum: 2,
    maximum: 20,
    description: 'UserSurname',
    example: 'Kuzmin',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Length(2, 20)
  surname: string;

  @ApiProperty({
    type: Number,
    minimum: 5,
    maximum: 115,
    description: 'Age',
    example: '33',
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Min(5)
  @Max(115)
  @Type(() => Number)
  age: object = { $gte: Number, $lte: Number };

  @ApiPropertyOptional({
    type: String,
    description: 'Gender',
    example: 'male',
    enum: ['male', 'female'],
  })
  @IsOptional()
  @IsEnum(UserGenderEnum)
  gender: UserGenderEnum;

  @ApiProperty({ description: 'User role' })
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(UserRoleEnum)
  role: UserRoleEnum;

  @ApiProperty({ description: 'User status' })
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(UserStatusEnum)
  status: UserStatusEnum;
}
