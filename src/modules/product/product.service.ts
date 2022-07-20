import * as fs from 'fs-extra';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { ActionEnum } from '../../constants';
import { CreateProductDto } from './dto';
import { IProduct } from './dto';
import { LogService } from '../log/log.service';
import { Product, ProductType } from './schemas/product-schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductType>,
    private logService: LogService,
  ) {}

  async createProduct(
    createProductDto: CreateProductDto,
    authId: string,
  ): Promise<IProduct> {
    const isDuplicateTitle = await this.productModel
      .findOne({ title: createProductDto.title })
      .exec();

    if (isDuplicateTitle) {
      throw new BadRequestException(
        `Product with title ${createProductDto.title} exist already`,
      );
    }

    const newProduct = await new this.productModel({
      ...createProductDto,
    });
    newProduct.price = createProductDto.originalPrice;

    await this.logService.createLog({
      event: ActionEnum.USER_PRODUCT_CREATE,
      userId: authId,
      data: { productId: newProduct._id },
    });
    return await newProduct.save();
  }

  async addProductImageFiles(
    authId: string,
    productId: string,
    files: Express.Multer.File[],
  ): Promise<IProduct> {
    const photosArr = files.map((v) => v.originalname);
    const updatedProduct = await this.productModel.findByIdAndUpdate(
      productId,
      { photos: photosArr },
      { new: true },
    );

    if (!updatedProduct) {
      throw new NotFoundException('Product not found');
    }

    const pathBase = `${process.cwd()}/upload`;
    const pathIn = `${pathBase}/temp`;
    const pathOut = `${pathBase}/products/${updatedProduct.title}`;

    await fs.copy(pathIn, pathOut);
    await fs.emptyDir(pathIn);
    await this.logService.createLog({
      event: ActionEnum.USER_PRODUCT_UPDATE,
      userId: authId,
      data: { productId: updatedProduct._id, addPhotos: photosArr },
    });
    return updatedProduct;
  }
}
