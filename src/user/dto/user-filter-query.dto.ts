import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';
import { Type } from 'class-transformer';

import { UserGenderEnum } from '../constants/user-gender-enum';
import { UserRoleEnum } from '../constants/user-role-enum';
import { UserStatusEnum } from '../constants/user-status-enum';

export class UserFilterQueryDto {
  @ApiPropertyOptional({
    type: String,
    minLength: 2,
    maxLength: 20,
    description: 'Username',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Length(2, 20)
  name: string;

  @ApiPropertyOptional({
    type: String,
    minLength: 2,
    maxLength: 20,
    description: 'UserSurname',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Length(2, 20)
  surname: string;

  @ApiPropertyOptional({
    type: Number,
    description: 'Minimum user age',
    minimum: 5,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  ageMin = 5;

  @ApiPropertyOptional({
    type: Number,
    description: 'Maximum user age',
    maximum: 115,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  ageMax = 115;

  @ApiPropertyOptional({
    type: String,
    description: 'Gender',
    enum: UserGenderEnum,
  })
  @IsOptional()
  @IsEnum(UserGenderEnum)
  gender: UserGenderEnum;

  @ApiPropertyOptional({
    type: String,
    description: 'User role',
    enum: UserRoleEnum,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(UserRoleEnum)
  role: UserRoleEnum;

  @ApiPropertyOptional({
    type: String,
    description: 'User status',
    enum: UserStatusEnum,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(UserStatusEnum)
  status: UserStatusEnum;

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
