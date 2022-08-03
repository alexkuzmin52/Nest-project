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
    const index = userCart.products.findIndex(
      (value: ICartProduct) =>
        value.productId.toString() === changeCountProductDto.productId,
    );
    if (index === -1) {
      throw new NotFoundException('Product not found');
    }

    userCart.products[index].price = product.price;
    userCart.products[index].count = changeCountProductDto.count;
    userCart.products[index].cost = product.price * changeCountProductDto.count;

    userCart.amount = userCart.products.length;
    userCart.totalCost = userCart.products.reduce<number>(
      (prev: number, cur: Partial<ICartProduct>) => prev + cur.cost,
      0,
    );
    return await this.cartModel
      .findByIdAndUpdate(userCart._id, userCart, { new: true })
      .exec();
  }
}
