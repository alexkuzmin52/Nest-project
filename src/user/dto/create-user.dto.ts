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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RegexEnum } from '../constants/regex-enum';
import { UserGenderEnum } from '../constants/user-gender-enum';

export class CreateUserDto {
  @ApiProperty({
    type: String,
    minimum: 2,
    maximum: 20,
    description: 'Username',
    example: 'Alex',
  })
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
  @IsNotEmpty()
  @IsString()
  @Length(2, 20)
  surname: string;

  @ApiProperty({
    type: String,
    minimum: 6,
    description: 'Email',
    example: 'someEmail@site.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

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
  age: number;

  @ApiProperty({
    type: String,
    description: 'Phone',
    example: '+380671234567',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(RegexEnum.phone)
  phone: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Gender',
    example: 'male',
    enum: ['male', 'female'],
  })
  @IsOptional()
  @IsEnum(UserGenderEnum)
  gender: UserGenderEnum;
}
