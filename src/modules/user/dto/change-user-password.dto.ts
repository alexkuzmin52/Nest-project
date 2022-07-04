import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

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
