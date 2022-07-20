import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, IsPositive, Max } from 'class-validator';

export class ItemDimensionsDto {
  @ApiPropertyOptional({
    description: 'Item length in millimeters',
    default: null,
    example: 2000,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Max(6000)
  length: number;

  @ApiPropertyOptional({
    description: 'Item width in millimeters',
    default: null,
    maximum: 3000,
    example: 1500,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Max(3000)
  width: number;

  @ApiPropertyOptional({
    description: 'Item height in millimeters',
    default: null,
    maximum: 3000,
    example: 1500,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Max(3000)
  height: number;

  @ApiPropertyOptional({
    description: 'Item weight in kilograms',
    default: null,
    maximum: 6000,
    example: 20.58,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Max(6000)
  weight: number;
}
