import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class UpdateSubCategoryDto {
  // code?: number;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  @Length(2, 32)
  title?: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsUrl()
  url?: string;

  // logo?: string;
}
