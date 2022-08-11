import { ApiProperty } from '@nestjs/swagger';
import { IProduct } from '../dto';

export class ProductDiscountEvent {
  @ApiProperty()
  payload: IProduct;
}
