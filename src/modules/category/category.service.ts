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
import { SubCategoryService } from '../subcategory/subcategory.service';
import { UpdateCategoryDto } from './dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryType>,
    private subcategoryService: SubCategoryService,
  ) {}

  async getAllCategories(): Promise<ICategory[]> {
    return await this.categoryModel.find().exec();
  }

  async createCategory(
    createCategoryDto: CreateCategoryDto,
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

    const newCategory = new this.categoryModel(createCategoryDto);
    return await newCategory.save();
  }

  async updateCategory(
    categoryId: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<ICategory> {
    const updatedCategory = await this.categoryModel.findByIdAndUpdate(
      categoryId,
      updateCategoryDto,
      { new: true },
    );

    if (!updatedCategory) {
      throw new NotFoundException('updated category not found');
    }
    return updatedCategory;
  }

  async getCategory(categoryId: string): Promise<ICategory> {
    const categoryById = await this.categoryModel.findById(categoryId).exec();

    if (!categoryById) {
      throw new NotFoundException('category not found');
    }
    return categoryById;
  }

  async deleteCategory(categoryId: string) {
    const deletedCategory = await this.categoryModel
      .findByIdAndDelete(categoryId)
      .exec();

    if (!deletedCategory) {
      throw new NotFoundException('deleted category not found');
    }
    return deletedCategory;
  }

  async addSubCategory(
    addSubCategoryDto: AddSubCategoryDto,
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

    return await updatedCategory.save();
  }
}
