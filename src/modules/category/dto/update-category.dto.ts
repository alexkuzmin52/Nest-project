import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class UpdateCategoryDto {
  // code?: number;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  @Length(2, 32)
  title?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsUrl()
  url?: string;

  // logo?: string;
}
