import { CartStatusEnum } from '../../../constants';

export interface ICart {
  _id: string;
  userId: string;
  products: [
    {
      productId: string;
      price: number;
      count: number;
      cost: number;
    },
  ];
  amount: number;
  totalCost: number;
  status: CartStatusEnum;
}
