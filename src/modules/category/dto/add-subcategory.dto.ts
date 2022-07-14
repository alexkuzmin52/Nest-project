import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddSubCategoryDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  categoryTitle: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  subcategoryTitle: string;
}
