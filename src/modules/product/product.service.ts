import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { IProduct } from './dto/product.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductType } from './schemas/product-schema';
import { Model } from 'mongoose';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductType>,
  ) {}

  async createProduct(createProductDto: CreateProductDto): Promise<IProduct> {
    const newProduct = await new this.productModel(createProductDto);
    return await newProduct.save();
  }
}
