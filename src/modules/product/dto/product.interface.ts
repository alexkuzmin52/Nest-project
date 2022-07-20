// import { IItemDimensions } from './item-dimensions.interface';
// import { IPackageDimensions } from './package-dimensions.interface';
// import { IReview } from './review.interface';
// import { ProductTypeEnum } from '../../../constants/product-type-enum';

import { ProductTypeEnum } from '../../../constants/product-type-enum';
import { IItemDimensions } from './item-dimensions.interface';
import { IPackageDimensions } from './package-dimensions.interface';

export interface IProduct {
  _id: string;
  accountingType: ProductTypeEnum;
  brand: string;
  category: string;
  // code: number; TODO
  countryOfManufacture: string;
  createdAt: string;
  discount: number;
  discountFlag: boolean;
  originalPrice: number;
  equipment: string;
  fullCharacteristics: string;
  fullDescription: string;
  // id: number; TODO
  newFlag: boolean;
  overview_url: string;
  packageAmount?: number;
  packageDimensions?: IPackageDimensions;
  itemDimensions?: IItemDimensions;
  photos?: string[];
  price: number;
  promoFlag: boolean;
  provider: string;
  // reviews?: IReview[]; TODO
  shortCharacteristics: string;
  shortDescription: string;
  stockCount: number;
  storeCount: number;
  title: string;
  updatedAt: string;
  userID: string;
}
