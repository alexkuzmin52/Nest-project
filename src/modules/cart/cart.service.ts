import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Cart, CartType } from './schemas';
import {
  CartProductDto,
  ChangeCountProductDto,
  ICart,
  ICartProduct,
} from './dto';
import { CartStatusEnum } from '../../constants';
import { ProductService } from '../product/product.service';
import { recalculateCartHelper } from './helpers/recalculate-cart-helper';
import { CartQueryFilterDto } from './dto/cart-query-filter.dto';
import { ProductFilterDto } from '../product/dto';
import { CartFilterDto } from './dto/cart-filter.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartType>,
    private productService: ProductService,
  ) {}
  async addProductToCartDto(
    cartProductDto: CartProductDto,
    authId: string,
  ): Promise<ICart> {
    const userCart = await this.getUserCartByUserId(authId);
    const product = await this.productService.getProduct(
      cartProductDto.productId,
    );
    const index = userCart.products.findIndex(
      (value: ICartProduct) =>
        value.productId.toString() === cartProductDto.productId,
    );

    if (index !== -1) {
      throw new BadRequestException(
        'Product have already been added to the cart',
      );
    }

    const productToCart = {
      productId: cartProductDto.productId,
      count: 1,
      price: product.price,
      cost: product.price,
    };
    userCart.products.push(productToCart);
    userCart.amount++;
    userCart.totalCost += product.price;
    userCart.status = CartStatusEnum.IN_PROGRESS;

    const updatedCart = await this.cartModel
      .findByIdAndUpdate(userCart._id, userCart, { new: true })
      .exec();

    return updatedCart;
  }

  async getUserCartByUserId(authId: string): Promise<ICart> {
    const existUserCart = await this.cartModel
      .findOne({ userId: authId })
      .exec();

    if (!existUserCart) {
      const initUserCart = await new this.cartModel({ userId: authId });
      return await initUserCart.save();
    }

    return existUserCart;
  }

  async changeCountOfProductCart(
    authId: string,
    changeCountProductDto: ChangeCountProductDto,
  ): Promise<ICart> {
    const userCart = await this.getUserCartByUserId(authId);
    const product = await this.productService.getProduct(
      changeCountProductDto.productId,
    );

    const recalculateCart = recalculateCartHelper(
      userCart,
      product,
      changeCountProductDto.count,
    );

    return this.cartModel.findByIdAndUpdate(userCart._id, recalculateCart, {
      new: true,
    });
  }

  async getAllCartsByFilter(
    authId: string,
    query: CartQueryFilterDto,
  ): Promise<ICart[]> {
    const { limit, page, sortingDirection, sortingField, ...rest } = query;
    const skip = limit * (page - 1);
    const filter: CartFilterDto = { ...rest };

    return await this.cartModel
      .find(filter)
      .sort([[sortingField, sortingDirection]])
      .skip(skip)
      .limit(limit)
      .exec();
  }
}
