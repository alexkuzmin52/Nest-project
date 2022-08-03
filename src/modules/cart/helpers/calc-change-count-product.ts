import { ICartProduct } from '../dto';

export const getTotalCostAndAmount = (
  products: Array<Partial<ICartProduct>>,
): object => {
  const data = { totalCost: 0, amount: products.length };

  for (const product of products) {
    data.totalCost += product.cost * product.price;
  }

  return data;
};
