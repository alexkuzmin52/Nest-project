import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl, Length } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @Length(2, 32)
  title: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsUrl()
  url: string;
}
