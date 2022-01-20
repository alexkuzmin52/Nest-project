import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetDto {
  @ApiProperty({ example: 'passWOrd123', description: 'Password' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
