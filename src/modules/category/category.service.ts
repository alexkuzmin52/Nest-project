import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryType } from './schemas/category-schema';
import { Model } from 'mongoose';
import { ICategory } from './dto/category.interface';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ConfigService } from '@nestjs/config';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryType>,
    private configService: ConfigService,
  ) {}

  async getAllCategories(): Promise<ICategory[]> {
    return await this.categoryModel.find().exec();
  }

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<ICategory> {
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
}
