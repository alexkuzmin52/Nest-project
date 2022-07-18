import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { IProduct } from './dto/product.interface';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post('')
  async createProduct(
    @Body() createProductDto: CreateProductDto,
  ): Promise<IProduct> {
    return await this.productService.createProduct(createProductDto);
  }
}
