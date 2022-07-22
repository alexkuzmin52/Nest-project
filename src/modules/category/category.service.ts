import { AddSubCategoryDto } from './dto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Category, CategoryType } from './schemas/category-schema';
import { CreateCategoryDto } from './dto';
import { ICategory } from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MoveSubCategoryDto } from './dto';
import { RemoveSubCategoryDto } from './dto';
import { SubCategoryService } from '../subcategory/subcategory.service';
import { UpdateCategoryDto } from './dto';
import { LogService } from '../log/log.service';
import { ActionEnum } from '../../constants';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryType>,
    private logService: LogService,
    private subcategoryService: SubCategoryService,
  ) {}

  async getAllCategories(): Promise<ICategory[]> {
    return await this.categoryModel.find().exec();
  }

  async createCategory(
    createCategoryDto: CreateCategoryDto,
    authId: string,
  ): Promise<ICategory> {
    const isExistCategoryWithSameTittle = await this.categoryModel
      .findOne({
        title: createCategoryDto.title,
      })
      .exec();

    if (isExistCategoryWithSameTittle) {
      throw new BadRequestException(
        `Category with title ${createCategoryDto.title} already exist`,
      );
    }

    const newCategory = await new this.categoryModel(createCategoryDto);

    await this.logService.createLog({
      userId: authId,
      event: ActionEnum.USER_CATEGORY_CREATE,
      data: newCategory._id,
    });

    return await newCategory.save();
  }

  async updateCategory(
    categoryId: string,
    updateCategoryDto: UpdateCategoryDto,
    authId: string,
  ): Promise<ICategory> {
    const updatedCategory = await this.categoryModel.findByIdAndUpdate(
      categoryId,
      updateCategoryDto,
      { new: true },
    );

    if (!updatedCategory) {
      throw new NotFoundException('updated category not found');
    }

    await this.logService.createLog({
      userId: authId,
      event: ActionEnum.USER_CATEGORY_UPDATE,
      data: updatedCategory._id,
    });

    return updatedCategory;
  }

  async getCategory(categoryId: string): Promise<ICategory> {
    const categoryById = await this.categoryModel.findById(categoryId).exec();

    if (!categoryById) {
      throw new NotFoundException('category not found');
    }

    return categoryById;
  }

  async deleteCategory(categoryId: string, authId: string): Promise<ICategory> {
    const deletedCategory = await this.categoryModel
      .findByIdAndDelete(categoryId)
      .exec();

    if (!deletedCategory) {
      throw new NotFoundException('deleted category not found');
    }

    await this.logService.createLog({
      userId: authId,
      event: ActionEnum.USER_CATEGORY_DELETE,
      data: deletedCategory._id,
    });

    return deletedCategory;
  }

  async addSubCategory(
    addSubCategoryDto: AddSubCategoryDto,
    authId: string,
  ): Promise<ICategory> {
    const addedSubCategory =
      await this.subcategoryService.getSubCategoryByTitle({
        title: addSubCategoryDto.subcategoryTitle,
      });

    const category = await this.categoryModel
      .findOne({
        title: addSubCategoryDto.categoryTitle,
      })
      .exec();

    if (!category) {
      throw new BadRequestException('Category not found');
    }

    const updatedSubCategory =
      await this.subcategoryService.updateSubCategoryByParentId(
        addedSubCategory._id,
        { parentId: category._id },
      );

    const updatedCategory = await this.categoryModel
      .findOneAndUpdate(
        { title: addSubCategoryDto.categoryTitle },
        { $push: { subcategory: updatedSubCategory } },
        { new: true },
      )
      .exec();

    await this.logService.createLog({
      userId: authId,
      event: ActionEnum.USER_CATEGORY_ADD_SUBCATEGORY,
      data: {
        category: updatedCategory._id,
        subcategory: updatedSubCategory._id,
      },
    });

    return await updatedCategory.save();
  }

  async removeSubCategory(
    removeSubCategoryDto: RemoveSubCategoryDto,
    authId: string,
  ): Promise<ICategory> {
    const removedSubCategory =
      await this.subcategoryService.getSubCategoryByTitle({
        title: removeSubCategoryDto.subcategoryTitle,
      });

    const category = await this.categoryModel
      .findOne({
        title: removeSubCategoryDto.categoryTitle,
      })
      .exec();

    if (!category) {
      throw new BadRequestException('Category not found');
    }

    const updatedSubCategory =
      await this.subcategoryService.updateSubCategoryByParentId(
        removedSubCategory._id,
        { parentId: null },
      );

    const updatedCategory = await this.categoryModel
      .findOneAndUpdate(
        { title: removeSubCategoryDto.categoryTitle },
        {
          $pull: {
            subcategory: { title: removeSubCategoryDto.subcategoryTitle },
          },
        },
        { new: true },
      )
      .exec();

    await this.logService.createLog({
      userId: authId,
      event: ActionEnum.USER_CATEGORY_REMOVE_SUBCATEGORY,
      data: {
        category: updatedCategory._id,
        subcategory: updatedSubCategory._id,
      },
    });

    return await updatedCategory.save();
  }

  async moveSubCategory(
    moveSubCategoryDto: MoveSubCategoryDto,
    authId: string,
  ): Promise<ICategory> {
    const remove_sub = {
      categoryTitle: moveSubCategoryDto.categoryTitle,
      subcategoryTitle: moveSubCategoryDto.subcategoryTitle,
    };

    const add_sub = {
      categoryTitle: moveSubCategoryDto.targetCategoryTitle,
      subcategoryTitle: moveSubCategoryDto.subcategoryTitle,
    };

    await this.removeSubCategory(remove_sub, authId);

    await this.logService.createLog({
      userId: authId,
      event: ActionEnum.USER_CATEGORY_MOVE_SUBCATEGORY,
      data: {
        subcategory: moveSubCategoryDto.subcategoryTitle,
        fromCategory: moveSubCategoryDto.categoryTitle,
        toCategory: moveSubCategoryDto.targetCategoryTitle,
      },
    });

    return await this.addSubCategory(add_sub, authId);
  }
}
