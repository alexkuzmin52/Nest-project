import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

import { CreateSubCategoryDto } from './dto';
import { ISubCategory } from './dto';
import { SubCategory } from './schemas/sub-category-schema';
import { SubCategoryService } from './subcategory.service';
import { UpdateSubCategoryDto } from './dto';
import { UserRole } from '../../decorators';
import { UserRoleEnum } from '../../constants';
import { UserRoleGuard } from '../../guards';

@ApiTags('Categories')
@Controller('subcategory')
export class SubCategoryController {
  constructor(private subcategoryService: SubCategoryService) {}

  @ApiOperation({ summary: 'Get all categories' })
  @Get('')
  async getProductSubCategories(): Promise<ISubCategory[]> {
    return await this.subcategoryService.getAllSubCategories();
  }

  @ApiOperation({ summary: 'Get subcategory' })
  @Get('/:id')
  async getProductSubCategory(
    @Param('id') subcategoryId: string,
  ): Promise<ISubCategory> {
    return await this.subcategoryService.getSubCategory(subcategoryId);
  }

  @ApiOperation({ summary: 'Create subcategory' })
  @ApiResponse({ status: 201, type: SubCategory })
  @UserRole(UserRoleEnum.ADMIN, UserRoleEnum.MANAGER)
  @UseGuards(UserRoleGuard)
  @Post('')
  async createProductSubCategory(
    @Body() createSubCategoryDto: CreateSubCategoryDto,
  ): Promise<ISubCategory> {
    return await this.subcategoryService.createSubCategory(
      createSubCategoryDto,
    );
  }

  @ApiOperation({ summary: 'Create subcategory' })
  @ApiResponse({ status: 201, type: SubCategory })
  @UserRole(UserRoleEnum.ADMIN, UserRoleEnum.MANAGER)
  @UseGuards(UserRoleGuard)
  @Put('/:id')
  async updateProductSubCategory(
    @Body() updateSubCategoryDto: UpdateSubCategoryDto,
    @Param('id') subcategoryId: string,
  ): Promise<ISubCategory> {
    return await this.subcategoryService.updateSubCategory(
      subcategoryId,
      updateSubCategoryDto,
    );
  }

  @ApiOperation({ summary: 'Create subcategory' })
  @ApiResponse({ status: 201, type: SubCategory })
  @Delete('/:id')
  @UserRole(UserRoleEnum.ADMIN, UserRoleEnum.MANAGER)
  @UseGuards(UserRoleGuard)
  async deleteProductSubCategory(
    @Param('id') subcategoryId: string,
  ): Promise<ISubCategory> {
    return await this.subcategoryService.deleteSubCategory(subcategoryId);
  }
}
