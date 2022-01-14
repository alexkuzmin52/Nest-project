import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'alex@some.com', description: 'Email' })
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @ApiProperty({ example: 'passWOrd123', description: 'Password' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
