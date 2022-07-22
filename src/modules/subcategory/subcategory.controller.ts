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

import { CreateSubCategoryDto } from './dto';
import { ISubCategory } from './dto';
import { SubCategory } from './schemas/sub-category-schema';
import { SubCategoryService } from './subcategory.service';
import { UpdateSubCategoryDto } from './dto';
import { AuthId, UserRole } from '../../decorators';
import { UserRoleEnum } from '../../constants';
import { UserRoleGuard } from '../../guards';
import { Category } from '../category/schemas/category-schema';
import { ValidatorMongoIdPipe } from '../../pipes/validator-mongo-id.pipe';

@ApiTags('Subcategories')
@Controller('subcategory')
export class SubCategoryController {
  constructor(private subcategoryService: SubCategoryService) {}

  @ApiOperation({ summary: 'Get all subcategories' })
  @ApiOkResponse({ type: [SubCategory] })
  @Get('')
  async getProductSubCategories(): Promise<ISubCategory[]> {
    return await this.subcategoryService.getAllSubCategories();
  }

  @ApiOperation({ summary: 'Get subcategory' })
  @ApiResponse({ status: 200, type: Category })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiSecurity('access-key')
  @Get('/:id')
  async getProductSubCategory(
    @Param('id', ValidatorMongoIdPipe) subcategoryId: string,
  ): Promise<ISubCategory> {
    return await this.subcategoryService.getSubCategory(subcategoryId);
  }

  @ApiOperation({ summary: 'Create subcategory' })
  @ApiCreatedResponse({ type: SubCategory })
  @UserRole(UserRoleEnum.ADMIN, UserRoleEnum.MANAGER)
  @ApiBadRequestResponse()
  @ApiForbiddenResponse()
  @ApiSecurity('access-key')
  @UseGuards(UserRoleGuard)
  @Post('')
  async createProductSubCategory(
    @Body() createSubCategoryDto: CreateSubCategoryDto,
    @AuthId() authId: string,
  ): Promise<ISubCategory> {
    return await this.subcategoryService.createSubCategory(
      createSubCategoryDto,
      authId,
    );
  }

  @ApiOperation({ summary: 'Update subcategory' })
  @ApiOkResponse({ type: SubCategory })
  @ApiBadRequestResponse()
  @ApiForbiddenResponse()
  @ApiNotFoundResponse()
  @ApiSecurity('access-key')
  @UserRole(UserRoleEnum.ADMIN, UserRoleEnum.MANAGER)
  @UseGuards(UserRoleGuard)
  @Put('/:id')
  async updateProductSubCategory(
    @Body() updateSubCategoryDto: UpdateSubCategoryDto,
    @Param('id', ValidatorMongoIdPipe) subcategoryId: string,
    @AuthId() authId: string,
  ): Promise<ISubCategory> {
    return await this.subcategoryService.updateSubCategory(
      subcategoryId,
      updateSubCategoryDto,
      authId,
    );
  }

  @ApiOperation({ summary: 'Delete subcategory' })
  @ApiOkResponse({ type: SubCategory })
  @ApiBadRequestResponse()
  @ApiForbiddenResponse()
  @ApiNotFoundResponse()
  @ApiSecurity('access-key')
  @Delete('/:id')
  @UserRole(UserRoleEnum.ADMIN, UserRoleEnum.MANAGER)
  @UseGuards(UserRoleGuard)
  async deleteProductSubCategory(
    @Param('id', ValidatorMongoIdPipe) subcategoryId: string,
    @AuthId() authId: string,
  ): Promise<ISubCategory> {
    return await this.subcategoryService.deleteSubCategory(
      subcategoryId,
      authId,
    );
  }
}
