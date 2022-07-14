import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from '../auth/auth.module';
import { LogModule } from '../log/log.module';
import { SubCategory, SubCategorySchema } from './schemas/sub-category-schema';
import { SubCategoryController } from './subcategory.controller';
import { SubCategoryService } from './subcategory.service';

@Module({
  imports: [
    LogModule,
    MongooseModule.forFeature([
      { name: SubCategory.name, schema: SubCategorySchema },
    ]),
    forwardRef(() => AuthModule),
  ],
  controllers: [SubCategoryController],
  providers: [SubCategoryService],
  exports: [SubCategoryService],
})
export class SubCategoryModule {}
