import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from '../auth/auth.module';
import { FileModule } from '../file/file.module';
import { LogModule } from '../log/log.module';
import { Product, productSchema } from './schemas/product-schema';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: productSchema }]),
    FileModule,
    LogModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
