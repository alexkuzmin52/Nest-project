import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CategoryService } from '../modules/category/category.service';
import { SubCategoryService } from '../modules/subcategory/subcategory.service';

@Injectable()
export class ParentIdGuard implements CanActivate {
  constructor(
    private categoryService: CategoryService,
    private subcategoryService: SubCategoryService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const _body = req.body;
    const addedSubCategory =
      await this.subcategoryService.getSubCategoryByTitle({
        title: _body.subcategoryTitle,
      });
    if (addedSubCategory.parentId) {
      throw new ForbiddenException(
        `Subcategory ${_body.subcategoryTitle} is child element for category _id: ${addedSubCategory.parentId}`,
      );
    }
    return true;
  }
}
