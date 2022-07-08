import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

import { UserGenderEnum } from '../../../constants';
import { RegexEnum } from '../../../constants';

export class UpdateUserDto {
  @ApiPropertyOptional({
    example: 'Alex',
    description: 'The name of the User',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Length(2, 20)
  name: string;
  @ApiPropertyOptional({
    example: 'Kuzmin',
    description: 'The surname of the User',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Length(2, 20)
  surname: string;
  @ApiPropertyOptional({ example: 33, description: 'Age' })
  @IsOptional()
  @IsInt()
  @Min(5)
  @Max(115)
  age: number;
  @ApiPropertyOptional({ example: '0663334455', description: 'Phone' })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Matches(RegexEnum.phone)
  phone: string;
  @ApiPropertyOptional({ example: 'male', enum: ['male', 'female'] })
  @IsOptional()
  @IsEnum(UserGenderEnum)
  gender: UserGenderEnum;
}
