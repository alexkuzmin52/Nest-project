import * as fs from 'fs-extra';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ActionEnum } from '../../constants';
import {
  CreateProductDto,
  ProductFilterDto,
  ProductQueryFilterDto,
  UpdateProductDto,
} from './dto';
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

  async getProducts(): Promise<IProduct[]> {
    return await this.productModel.find().exec();
  }

  async getProduct(productId: string): Promise<IProduct> {
    const productById = await this.productModel.findById(productId).exec();
    if (!productById) {
      throw new NotFoundException('Product not found');
    }
    return productById;
  }

  async updateProductById(
    updateProductDto: UpdateProductDto,
    authId: string,
    productId: string,
  ): Promise<IProduct> {
    const updatedProduct = await this.productModel
      .findByIdAndUpdate(productId, updateProductDto, { new: true })
      .exec();

    if (!updatedProduct) {
      throw new NotFoundException('Updated product not found');
    }

    await this.logService.createLog({
      userId: authId,
      event: ActionEnum.USER_PRODUCT_UPDATE,
      data: updatedProduct._id,
    });
    return updatedProduct;
  }

  async removeProductById(productId: string, authId): Promise<IProduct> {
    const deletedProduct = await this.productModel
      .findByIdAndDelete(productId)
      .exec();

    if (!deletedProduct) {
      throw new NotFoundException('Deleted product not found');
    }

    await this.logService.createLog({
      userId: authId,
      event: ActionEnum.USER_PRODUCT_DELETE,
      data: deletedProduct._id,
    });
    return deletedProduct;
  }

  async getProductsByFilter(query: ProductQueryFilterDto): Promise<IProduct[]> {
    const {
      limit,
      page,
      sortingDirection,
      sortingField,
      stockCountMax,
      stockCountMin,
      storeCountMax,
      storeCountMin,
      ...rest
    } = query;
    const stockCount = { $gte: stockCountMin, $lte: stockCountMax };
    const storeCount = { $gte: storeCountMin, $lte: storeCountMax };
    const skip = limit * (page - 1);
    const filter: ProductFilterDto = { ...rest, stockCount, storeCount };

    return await this.productModel
      .find(filter, { password: 0 })
      .sort([[sortingField, sortingDirection]])
      .skip(skip)
      .limit(limit)
      .exec();
  }
}
