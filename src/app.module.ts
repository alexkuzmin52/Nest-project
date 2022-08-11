import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './modules/auth/auth.module';
import { CartModule } from './modules/cart/cart.module';
import { CategoryModule } from './modules/category/category.module';
import { FileModule } from './modules/file/file.module';
import { LogModule } from './modules/log/log.module';
import { MailModule } from '../mail/mail.module';
import { ProductModule } from './modules/product/product.module';
import { SubCategoryModule } from './modules/subcategory/sub-category.module';
import { UserModule } from './modules/user/user.module';
import { configuration } from '../config/configuration';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    AuthModule,
    CartModule,
    CategoryModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `config/env/.${process.env.NODE_ENV}.env`,
      load: [configuration],
    }),
    EventEmitterModule.forRoot(),
    FileModule,
    LogModule,
    MailModule,
    MongooseModule.forRoot('mongodb://localhost:27017/nest-api'),
    ProductModule,
    SubCategoryModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
