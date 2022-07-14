import { MongooseModule } from '@nestjs/mongoose';
import { forwardRef, Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { Category, CategorySchema } from './schemas/category-schema';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { LogModule } from '../log/log.module';
import { SubCategoryModule } from '../subcategory/sub-category.module';

@Module({
  imports: [
    LogModule,
    SubCategoryModule,
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
    ]),
    forwardRef(() => AuthModule),
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
