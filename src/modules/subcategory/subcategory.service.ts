import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateSubCategoryDto } from './dto';
import { ISubCategory } from './dto';
import { SubCategory, SubCategoryType } from './schemas/sub-category-schema';
import { UpdateSubCategoryDto } from './dto';
import { ActionEnum } from '../../constants';
import { LogService } from '../log/log.service';

@Injectable()
export class SubCategoryService {
  constructor(
    @InjectModel(SubCategory.name)
    private subcategoryModel: Model<SubCategoryType>,
    private logService: LogService,
  ) {}

  async getAllSubCategories(): Promise<ISubCategory[]> {
    return await this.subcategoryModel.find().exec();
  }

  async createSubCategory(
    createSubCategoryDto: CreateSubCategoryDto,
    authId: string,
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

    await this.logService.createLog({
      userId: authId,
      event: ActionEnum.USER_SUB_CATEGORY_CREATE,
      data: newSubCategory._id,
    });

    return await newSubCategory.save();
  }

  async updateSubCategory(
    subcategoryId: string,
    updateSubCategoryDto: UpdateSubCategoryDto,
    authId: string,
  ): Promise<ISubCategory> {
    const updatedSubCategory = await this.subcategoryModel.findByIdAndUpdate(
      subcategoryId,
      updateSubCategoryDto,
      { new: true },
    );

    if (!updatedSubCategory) {
      throw new NotFoundException('updated subcategory not found');
    }

    await this.logService.createLog({
      userId: authId,
      event: ActionEnum.USER_SUB_CATEGORY_UPDATE,
      data: updatedSubCategory._id,
    });

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

  async deleteSubCategory(
    subcategoryId: string,
    authId: string,
  ): Promise<ISubCategory> {
    const deletedSubCategory = await this.subcategoryModel
      .findByIdAndDelete(subcategoryId)
      .exec();

    if (!deletedSubCategory) {
      throw new NotFoundException('deleted subcategory not found');
    }

    if (deletedSubCategory.parentId) {
      throw new ForbiddenException(
        `Subcategory ${deletedSubCategory.title} is child element for category _id: ${deletedSubCategory.parentId}`,
      );
    }

    await this.logService.createLog({
      userId: authId,
      event: ActionEnum.USER_SUB_CATEGORY_DELETE,
      data: deletedSubCategory._id,
    });

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
