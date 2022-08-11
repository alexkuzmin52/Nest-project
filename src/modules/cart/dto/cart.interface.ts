import { CartStatusEnum } from '../../../constants';
import { ICartProduct } from './cart-poduct.interface';

export interface ICart {
  _id: string;
  userId: string;
  products: ICartProduct[];
  amount: number;
  totalCost: number;
  status: CartStatusEnum;
}
