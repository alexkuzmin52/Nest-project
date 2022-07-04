import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ResetDto {
  @ApiProperty({ example: 'passWOrd123', description: 'Password' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
