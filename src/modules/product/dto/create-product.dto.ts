import {
  IsAlphanumeric,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @Length(2, 32)
  @IsAlphanumeric()
  title: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 32)
  // @IsAlphanumeric()
  category: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 32)
  @IsAlphanumeric()
  brand: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Min(0.01)
  price: number;
}
