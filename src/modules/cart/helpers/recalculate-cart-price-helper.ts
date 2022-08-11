import { NotFoundException } from '@nestjs/common';

import { ICart, ICartProduct } from '../dto';
import { IProduct } from '../../product/dto';

// TODO delete
export const recalculateCartPriceHelper = (
  cart: ICart,
  product: IProduct,
  // count: number,
): ICart => {
  const index = cart.products.findIndex((value: ICartProduct) => {
    return value.productId.toString() === product._id.toString();
  });

  if (index === -1) {
    throw new NotFoundException('Product not found');
  }

  cart.products[index].price = product.price;
  // cart.products[index].count = count;
  cart.products[index].cost = product.price * cart.products[index].count;

  // cart.amount = cart.products.length;
  cart.totalCost = cart.products.reduce<number>(
    (prev: number, cur: Partial<ICartProduct>) => prev + cur.cost,
    0,
  );
  return cart;
};
