import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from '../auth/auth.module';
import { Cart, cartSchema } from './schemas';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: cartSchema }]),
    forwardRef(() => AuthModule),
    forwardRef(() => ProductModule),
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
