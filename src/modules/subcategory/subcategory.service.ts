import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateSubCategoryDto } from './dto';
import { ISubCategory } from './dto';
import { SubCategory, SubCategoryType } from './schemas/sub-category-schema';
import { UpdateSubCategoryDto } from './dto';

@Injectable()
export class SubCategoryService {
  constructor(
    @InjectModel(SubCategory.name)
    private subcategoryModel: Model<SubCategoryType>,
  ) {}

  async getAllSubCategories(): Promise<ISubCategory[]> {
    return await this.subcategoryModel.find().exec();
  }

  async createSubCategory(
    createSubCategoryDto: CreateSubCategoryDto,
  ): Promise<ISubCategory> {
    const isExistSubCategoryWithSameTittle = await this.subcategoryModel
      .findOne({
        title: createSubCategoryDto.title,
      })
      .exec();

    if (isExistSubCategoryWithSameTittle) {
      throw new BadRequestException(
        `Subcategory with title ${createSubCategoryDto.title} already exist`,
      );
    }

    const newSubCategory = new this.subcategoryModel(createSubCategoryDto);
    return await newSubCategory.save();
  }

  async updateSubCategory(
    subcategoryId: string,
    updateSubCategoryDto: UpdateSubCategoryDto,
  ): Promise<ISubCategory> {
    const updatedSubCategory = await this.subcategoryModel.findByIdAndUpdate(
      subcategoryId,
      updateSubCategoryDto,
      { new: true },
    );
    if (!updatedSubCategory) {
      throw new NotFoundException('updated subcategory not found');
    }
    return updatedSubCategory;
  }

  async getSubCategory(subcategoryId: string): Promise<ISubCategory> {
    const subcategoryById = await this.subcategoryModel
      .findById(subcategoryId)
      .exec();

    if (!subcategoryById) {
      throw new NotFoundException('subcategory not found');
    }
    return subcategoryById;
  }

  async deleteSubCategory(subcategoryId: string): Promise<ISubCategory> {
    const deletedSubCategory = await this.subcategoryModel
      .findByIdAndDelete(subcategoryId)
      .exec();

    if (!deletedSubCategory) {
      throw new NotFoundException('deleted subcategory not found');
    }
    return deletedSubCategory;
  }

  async getSubCategoryByTitle(
    title: Partial<SubCategory>,
  ): Promise<ISubCategory> {
    const addedSubCategory = await this.subcategoryModel.findOne(title).exec();
    if (!addedSubCategory) {
      throw new NotFoundException('added subcategory not found');
    }
    return addedSubCategory;
  }

  async updateSubCategoryByParentId(
    subcategoryId: string,
    parentId: Partial<SubCategory>,
  ): Promise<ISubCategory> {
    const updatedSubCategory = await this.subcategoryModel
      .findByIdAndUpdate(subcategoryId, parentId, { new: true })
      .exec();

    if (!updatedSubCategory) {
      throw new NotFoundException('updated subcategory not found');
    }
    return await updatedSubCategory.save();
  }
}
