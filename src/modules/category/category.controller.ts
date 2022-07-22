import { AddSubCategoryDto } from './dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
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
import { MoveSubCategoryDto } from './dto';
import { ParentIdGuard } from '../../guards/parent-id.guard';
import { RemoveSubCategoryDto } from './dto';
import { UpdateCategoryDto } from './dto';
import { AuthId, UserRole } from '../../decorators';
import { UserRoleEnum } from '../../constants';
import { UserRoleGuard } from '../../guards';
import { ValidatorMongoIdPipe } from '../../pipes/validator-mongo-id.pipe';

@ApiTags('Categories')
@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ status: 200, type: [Category] })
  @Get('')
  async getProductCategories(): Promise<ICategory[]> {
    return await this.categoryService.getAllCategories();
  }

  @ApiOperation({ summary: 'Get category' })
  @ApiResponse({ status: 200, type: Category })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @Get('/:id')
  async getProductCategory(
    @Param('id', ValidatorMongoIdPipe) categoryId: string,
  ): Promise<ICategory> {
    return await this.categoryService.getCategory(categoryId);
  }

  @ApiOperation({ summary: 'Create category' })
  @ApiCreatedResponse({ type: Category })
  @ApiBadRequestResponse()
  @ApiForbiddenResponse()
  @ApiSecurity('access-key')
  @UserRole(UserRoleEnum.ADMIN, UserRoleEnum.MANAGER)
  @UseGuards(UserRoleGuard)
  @Post('')
  async createProductCategory(
    @Body() createCategoryDto: CreateCategoryDto,
    @AuthId() authId: string,
  ): Promise<ICategory> {
    return await this.categoryService.createCategory(createCategoryDto, authId);
  }

  @ApiOperation({ summary: 'Update category' })
  @ApiOkResponse({ type: Category })
  @ApiBadRequestResponse()
  @ApiForbiddenResponse()
  @ApiNotFoundResponse()
  @ApiSecurity('access-key')
  @UserRole(UserRoleEnum.ADMIN, UserRoleEnum.MANAGER)
  @UseGuards(UserRoleGuard)
  @Put('/:id')
  async updateProductCategory(
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Param('id', ValidatorMongoIdPipe) categoryId: string,
    @AuthId() authId: string,
  ): Promise<ICategory> {
    return await this.categoryService.updateCategory(
      categoryId,
      updateCategoryDto,
      authId,
    );
  }

  @ApiOperation({ summary: 'Delete category' })
  @ApiOkResponse({ type: Category })
  @ApiBadRequestResponse()
  @ApiForbiddenResponse()
  @ApiNotFoundResponse()
  @Delete('/:id')
  @ApiSecurity('access-key')
  @UserRole(UserRoleEnum.ADMIN, UserRoleEnum.MANAGER)
  @UseGuards(UserRoleGuard)
  async deleteProductCategory(
    @Param('id', ValidatorMongoIdPipe) categoryId: string,
    @AuthId() authId: string,
  ): Promise<ICategory> {
    return await this.categoryService.deleteCategory(categoryId, authId);
  }

  @ApiOperation({ summary: 'Add subcategory' })
  @ApiOkResponse({ type: Category })
  @ApiBadRequestResponse()
  @ApiForbiddenResponse()
  @ApiNotFoundResponse()
  @ApiSecurity('access-key')
  @Put('add/subcategory')
  @UserRole(UserRoleEnum.ADMIN, UserRoleEnum.MANAGER)
  @UseGuards(UserRoleGuard, ParentIdGuard)
  async addProductSubCategory(
    @Body() addSubCategoryDto: AddSubCategoryDto,
    @AuthId() authId: string,
  ): Promise<ICategory> {
    return await this.categoryService.addSubCategory(addSubCategoryDto, authId);
  }

  @ApiOperation({ summary: 'Remove subcategory' })
  @ApiOkResponse({ type: Category })
  @ApiBadRequestResponse()
  @ApiForbiddenResponse()
  @ApiNotFoundResponse()
  @ApiSecurity('access-key')
  @Put('remove/subcategory')
  @UserRole(UserRoleEnum.ADMIN, UserRoleEnum.MANAGER)
  @UseGuards(UserRoleGuard)
  async removeProductSubCategory(
    @Body() removeSubCategoryDto: RemoveSubCategoryDto,
    @AuthId() authId: string,
  ): Promise<ICategory> {
    return await this.categoryService.removeSubCategory(
      removeSubCategoryDto,
      authId,
    );
  }

  @ApiOperation({ summary: 'Move subcategory' })
  @ApiOkResponse({ type: Category })
  @ApiBadRequestResponse()
  @ApiForbiddenResponse()
  @ApiNotFoundResponse()
  @ApiSecurity('access-key')
  @Put('move/subcategory')
  @UserRole(UserRoleEnum.ADMIN, UserRoleEnum.MANAGER)
  @UseGuards(UserRoleGuard)
  async moveProductSubCategory(
    @Body() moveSubCategoryDto: MoveSubCategoryDto,
    @AuthId() authId: string,
  ): Promise<ICategory> {
    return await this.categoryService.moveSubCategory(
      moveSubCategoryDto,
      authId,
    );
  }
}
