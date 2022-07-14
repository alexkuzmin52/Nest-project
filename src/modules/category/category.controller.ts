import { AddSubCategoryDto } from './dto';
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
import { Category } from './schemas/category-schema';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto';
import { ICategory } from './dto';
import { UpdateCategoryDto } from './dto';
import { UserRole } from '../../decorators';
import { UserRoleEnum } from '../../constants';
import { UserRoleGuard } from '../../guards';

@ApiTags('Categories')
@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @ApiOperation({ summary: 'Get all categories' })
  @Get('')
  async getProductCategories(): Promise<ICategory[]> {
    return await this.categoryService.getAllCategories();
  }

  @ApiOperation({ summary: 'Get category' })
  @Get('/:id')
  async getProductCategory(
    @Param('id') categoryId: string,
  ): Promise<ICategory> {
    return await this.categoryService.getCategory(categoryId);
  }

  @ApiOperation({ summary: 'Create category' })
  @ApiResponse({ status: 201, type: Category })
  @UserRole(UserRoleEnum.ADMIN, UserRoleEnum.MANAGER)
  @UseGuards(UserRoleGuard)
  @Post('')
  async createProductCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<ICategory> {
    return await this.categoryService.createCategory(createCategoryDto);
  }

  @ApiOperation({ summary: 'Create category' })
  @ApiResponse({ status: 201, type: Category })
  @UserRole(UserRoleEnum.ADMIN, UserRoleEnum.MANAGER)
  @UseGuards(UserRoleGuard)
  @Put('/:id')
  async updateProductCategory(
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Param('id') categoryId: string,
  ): Promise<ICategory> {
    return await this.categoryService.updateCategory(
      categoryId,
      updateCategoryDto,
    );
  }

  @ApiOperation({ summary: 'Create category' })
  @ApiResponse({ status: 201, type: Category })
  @Delete('/:id')
  @UserRole(UserRoleEnum.ADMIN, UserRoleEnum.MANAGER)
  @UseGuards(UserRoleGuard)
  async deleteProductCategory(
    @Param('id') categoryId: string,
  ): Promise<ICategory> {
    return await this.categoryService.deleteCategory(categoryId);
  }
  @ApiOperation({ summary: 'Create category' })
  @ApiResponse({ status: 201, type: Category })
  @Put('add/subcategory')
  @UserRole(UserRoleEnum.ADMIN, UserRoleEnum.MANAGER)
  @UseGuards(UserRoleGuard)
  async addProductSubCategory(
    @Body() addSubCategoryDto: AddSubCategoryDto,
  ): Promise<ICategory> {
    return await this.categoryService.addSubCategory(addSubCategoryDto);
  }
}
