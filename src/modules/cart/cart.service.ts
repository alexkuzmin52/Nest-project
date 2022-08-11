import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ActionEnum, CartStatusEnum } from '../../constants';
import { CartFilterDto } from './dto';
import { CartQueryFilterDto } from './dto';
import { Cart, CartType } from './schemas';
import {
  CartProductDto,
  ChangeCountProductDto,
  ICart,
  ICartProduct,
} from './dto';
import { LogService } from '../log/log.service';
import { ProductDiscountEvent } from '../product/events/product-discount.event';
import { ProductService } from '../product/product.service';
import { recalculateCartHelper } from './helpers/recalculate-cart-helper';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartType>,
    private productService: ProductService,
    private logService: LogService,
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

    await this.logService.createLog({
      event: ActionEnum.USER_CART_UPDATE,
      data: { cart: updatedCart._id },
      userId: authId,
    });
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

    await this.logService.createLog({
      event: ActionEnum.USER_CART_UPDATE,
      data: { cart: userCart._id },
      userId: authId,
    });

    return this.cartModel
      .findByIdAndUpdate(userCart._id, recalculateCart, {
        new: true,
      })
      .exec();
  }

  async getAllCartsByFilter(query: CartQueryFilterDto): Promise<ICart[]> {
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

  async updateCartsByEvent(
    productDiscountEvent: ProductDiscountEvent,
  ): Promise<ICart[]> {
    const product = productDiscountEvent.payload;
    const carts = await this.cartModel.find().exec();
    const cartsForUpdate = [];

    for (const cart of carts) {
      const index = cart.products.findIndex((value: ICartProduct) => {
        return value.productId.toString() === product._id.toString();
      });
      if (index !== -1) {
        cart.products[index].price = product.price;
        cart.products[index].cost = product.price * cart.products[index].count;
        cart.totalCost = cart.products.reduce<number>(
          (prev: number, cur: Partial<ICartProduct>) => prev + cur.cost,
          0,
        );
        const updatedCart = await this.cartModel
          .findByIdAndUpdate(
            cart._id,
            { totalCost: cart.totalCost, products: cart.products },
            { new: true },
          )
          .exec();
        cartsForUpdate.push(updatedCart);
      }
    }
    await this.logService.createLog({
      event: ActionEnum.USER_CARTS_SET_DISCOUNT,
      data: { product: product._id, discount: product.discount },
      userId: product.userID,
    });

    return cartsForUpdate;
  }

  async deleteUserCartById(cartId: string): Promise<ICart> {
    const deletedCart = await this.cartModel.findByIdAndDelete(cartId).exec();
    if (!deletedCart) {
      throw new NotFoundException('Cart not found');
    }
    return deletedCart;
  }

  async removeCartProductById(
    userId: string,
    productId: string,
  ): Promise<ICart> {
    const updatedCart = await this.cartModel.findOneAndUpdate(
      { userId: userId },
      { $pull: { products: { productId: productId } } },
      { new: true },
    );

    updatedCart.amount = updatedCart.products.length;
    updatedCart.totalCost = updatedCart.products.reduce<number>(
      (prev: number, cur: Partial<ICartProduct>) => prev + cur.cost,
      0,
    );

    await updatedCart.save();
    return updatedCart;
  }
}
