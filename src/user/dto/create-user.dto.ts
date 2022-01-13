import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  Matches,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RegexEnum } from '../constants/regex-enum';
import { UserGenderEnum } from '../constants/user-gender-enum';

export class CreateUserDto {
  @ApiProperty({
    type: String,
    minimum: 2,
    description: 'Username',
    example: 'Alex',
  })
  @IsNotEmpty()
  @IsString()
  @Length(2, 20)
  name: string;
  @IsNotEmpty()
  @IsString()
  @Length(2, 20)
  surname: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Min(5)
  @Max(115)
  age: number;
  @Matches(RegexEnum.phone)
  phone: string;
  @IsOptional()
  @IsEnum(UserGenderEnum)
  gender: UserGenderEnum;
  // token: string;
}
